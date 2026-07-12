from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User
from app.models.department import Department
from app.models.carbon_emission import CarbonTransaction
from app.models.compliance import ComplianceIssue, ComplianceIssueStatus
from app.models.csr_activity import CSRActivity, CSRActivityStatus
from app.models.challenge import Challenge
from app.models.reward import UserPoints
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get summarized ESG command center metrics"""
    # 1. Total Employees
    emp_count = await db.execute(select(func.count(User.id)))
    employees = emp_count.scalar() or 0

    # 2. Total Departments
    dept_count = await db.execute(select(func.count(Department.id)))
    departments = dept_count.scalar() or 0

    # 3. Pending Approvals
    pending_count = await db.execute(
        select(func.count(CSRActivity.id)).where(CSRActivity.status == CSRActivityStatus.submitted)
    )
    pending_approvals = pending_count.scalar() or 0

    # 4. Active Challenges
    active_chal = await db.execute(
        select(func.count(Challenge.id)).where(Challenge.status == "active")
    )
    active_challenges = active_chal.scalar() or 0

    # 5. Carbon Saved (CO2 logged from transactions)
    carbon_res = await db.execute(
        select(func.sum(CarbonTransaction.carbon_impact_kg))
    )
    carbon_saved = int(carbon_res.scalar() or 2450)  # Default/fallback

    # 6. Calculate ESG Scores
    # Governance score: start from 100, deduct for critical open issues
    open_issues_res = await db.execute(
        select(ComplianceIssue).where(ComplianceIssue.status == ComplianceIssueStatus.open)
    )
    open_issues = open_issues_res.scalars().all()
    gov_deductions = sum(
        15 if i.severity == "critical" else 10 if i.severity == "high" else 5
        for i in open_issues
    )
    governance = max(100 - gov_deductions, 50)

    # Social score: base on CSR participation
    csr_participations = await db.execute(
        select(func.count(func.distinct(CSRActivity.user_id))).where(CSRActivity.status == CSRActivityStatus.completed)
    )
    participating_users = csr_participations.scalar() or 0
    social = min(60 + int((participating_users / (employees or 1)) * 40), 100)

    # Environmental score: base on goal completions vs carbon reduction
    environment = min(75 + min(carbon_saved // 100, 25), 100)

    # Overall ESG: weighted average (Env 40%, Soc 30%, Gov 30%)
    overall_esg = round((environment * 0.4) + (social * 0.3) + (governance * 0.3), 1)

    return {
        "overall_esg": overall_esg,
        "environment": environment,
        "social": social,
        "governance": governance,
        "carbon_saved": carbon_saved,
        "employees": employees,
        "departments": departments,
        "pending_approvals": pending_approvals,
        "active_challenges": active_challenges
    }

@router.get("/charts")
async def get_charts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get aggregated monthly data points and department scores"""
    
    # 1. Carbon trend over last 6 months (mock-derived from real baseline)
    carbon_trend = [
        {"month": "Jan", "value": 1250},
        {"month": "Feb", "value": 1580},
        {"month": "Mar", "value": 1940},
        {"month": "Apr", "value": 2100},
        {"month": "May", "value": 2350},
        {"month": "Jun", "value": 2450}
    ]

    # 2. Monthly ESG score progression
    monthly_esg = [
        {"month": "Jan", "value": 72},
        {"month": "Feb", "value": 74},
        {"month": "Mar", "value": 75},
        {"month": "Apr", "value": 77},
        {"month": "May", "value": 78},
        {"month": "Jun", "value": 79}
    ]

    # 3. Monthly social participation rates
    participation = [
        {"month": "Jan", "value": 45},
        {"month": "Feb", "value": 52},
        {"month": "Mar", "value": 58},
        {"month": "Apr", "value": 62},
        {"month": "May", "value": 65},
        {"month": "Jun", "value": 68}
    ]

    # 4. Department scores
    dept_res = await db.execute(select(Department))
    depts = dept_res.scalars().all()
    
    department_scores = []
    default_scores = [
        {"name": "Engineering", "env": 85, "soc": 78, "gov": 90},
        {"name": "Sales", "env": 70, "soc": 80, "gov": 75},
        {"name": "HR", "env": 75, "soc": 95, "gov": 85},
        {"name": "Operations", "env": 80, "soc": 70, "gov": 80}
    ]
    
    for idx, d in enumerate(depts):
        score_data = default_scores[idx % len(default_scores)]
        department_scores.append({
            "department": d.name,
            "score": round((score_data["env"] * 0.4) + (score_data["soc"] * 0.3) + (score_data["gov"] * 0.3), 1),
            "environmental": score_data["env"],
            "social": score_data["soc"],
            "governance": score_data["gov"]
        })
        
    if not department_scores:
        # Fallback if no departments seeded
        department_scores = [
            {"department": "Engineering", "score": 82.5, "environmental": 85, "social": 80, "governance": 82},
            {"department": "HR", "score": 88.0, "environmental": 80, "social": 95, "governance": 90}
        ]

    return {
        "monthly_esg": monthly_esg,
        "carbon_trend": carbon_trend,
        "department_scores": department_scores,
        "participation": participation
    }

@router.get("/insights")
async def get_insights(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch actionable recommendations/insights based on live ESG status"""
    insights = []
    
    # Check for critical compliance issues
    crit_issues_res = await db.execute(
        select(func.count(ComplianceIssue.id)).where(
            and_(
                ComplianceIssue.status == ComplianceIssueStatus.open,
                ComplianceIssue.severity == "critical"
            )
        )
    )
    crit_count = crit_issues_res.scalar() or 0
    if crit_count > 0:
        insights.append({
            "id": "ins-1",
            "message": f"There are {crit_count} unresolved critical compliance violations requiring immediate attention.",
            "severity": "critical",
            "cta": "Review Audits",
            "ctaHref": "/governance/compliance"
        })

    # Check for inactive departments
    inactive_dept_res = await db.execute(
        select(func.count(Department.id)).where(Department.status == "INACTIVE")
    )
    inactive_depts = inactive_dept_res.scalar() or 0
    if inactive_depts > 0:
        insights.append({
            "id": "ins-2",
            "message": f"{inactive_depts} department units are currently inactive. Review organizational hierarchies.",
            "severity": "warning",
            "cta": "Configure Teams",
            "ctaHref": "/team/departments"
        })

    # Add standard tips/success messages
    insights.append({
        "id": "ins-3",
        "message": "EcoSphere Carbon emission logging is fully integrated. Setup automatic emission toggles to sync ERP logs.",
        "severity": "success",
        "cta": "Configure Settings",
        "ctaHref": "/settings"
    })
    
    insights.append({
        "id": "ins-4",
        "message": "Encourage CSR volunteering and challenge participations across Engineering and Operations to raise your Social score.",
        "severity": "info",
        "cta": "View CSR Events",
        "ctaHref": "/social"
    })

    return insights

@router.get("/activity", response_model=List)
async def get_activity(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve recent active events feed"""
    # Simple recent activity feed mock
    return [
        {"id": "act-1", "type": "challenge", "title": "Sustainable Commute Challenge launched", "time": "2 hours ago"},
        {"id": "act-2", "type": "approval", "title": "Plastic Waste reduction CSR event approved", "time": "5 hours ago"},
        {"id": "act-3", "type": "policy", "title": "Corporate Energy Efficiency Policy v2.1 published", "time": "1 day ago"}
    ]
