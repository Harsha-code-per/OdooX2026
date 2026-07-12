import asyncio
from app.database import engine, Base, async_session_factory
from app.models.challenge import Challenge, ChallengeParticipation
from app.models.reward import Reward, RewardCategory, RewardStatus
from sqlalchemy import select, func
import datetime

async def setup():
    print("Connecting to live database and creating tables...")
    async with engine.begin() as conn:
        # Create challenges and challenge_participations tables
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")

    # Let's seed some challenges and rewards if empty
    async with async_session_factory() as session:
        # Check challenges
        chal_count = await session.execute(select(func.count(Challenge.id)))
        if chal_count.scalar() == 0:
            print("Seeding challenges...")
            challenges = [
                Challenge(
                    title="Zero Plastic Week",
                    description="Eliminate single-use plastics from your workspace and operations for one week.",
                    category="environmental",
                    difficulty="easy",
                    xp_reward=150,
                    points_reward=100,
                    status="active",
                    deadline=datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=14)
                ),
                Challenge(
                    title="Commute Green",
                    description="Use public transport, carpool, bike, or walk to work for 5 consecutive days.",
                    category="environmental",
                    difficulty="medium",
                    xp_reward=250,
                    points_reward=150,
                    status="active",
                    deadline=datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=20)
                ),
                Challenge(
                    title="Governance Policy Literacy",
                    description="Read and acknowledge all active ESG policies within 48 hours.",
                    category="governance",
                    difficulty="easy",
                    xp_reward=100,
                    points_reward=50,
                    status="active",
                    deadline=datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=7)
                ),
                Challenge(
                    title="Blood Donation Drive",
                    description="Participate or volunteer in the quarterly community health campaign.",
                    category="social",
                    difficulty="medium",
                    xp_reward=300,
                    points_reward=200,
                    status="active",
                    deadline=datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=30)
                )
            ]
            session.add_all(challenges)

        # Check rewards catalog
        reward_count = await session.execute(select(func.count(Reward.id)))
        if reward_count.scalar() == 0:
            print("Seeding rewards...")
            rewards = [
                Reward(
                    name="Organic Coffee Mug",
                    description="Reusable, plant-based sustainable fiber coffee travel mug.",
                    points_required=150,
                    stock_quantity=50,
                    status=RewardStatus.available,
                    category=RewardCategory.merchandise
                ),
                Reward(
                    name="Tree Planting in Your Name",
                    description="We will plant a native tree in your name with a GPS certificate tracking your tree.",
                    points_required=300,
                    stock_quantity=100,
                    status=RewardStatus.available,
                    category=RewardCategory.donation
                ),
                Reward(
                    name="Premium Corporate Hoodie",
                    description="Comfy, 100% organic cotton recycled fiber company hoodie.",
                    points_required=500,
                    stock_quantity=25,
                    status=RewardStatus.available,
                    category=RewardCategory.merchandise
                ),
                Reward(
                    name="Paid Volunteer Half-Day",
                    description="Get 4 hours of paid time-off to volunteer at any approved charity event.",
                    points_required=1000,
                    stock_quantity=10,
                    status=RewardStatus.available,
                    category=RewardCategory.time_off
                )
            ]
            session.add_all(rewards)

        await session.commit()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(setup())
