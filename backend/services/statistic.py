from databases.database_connector import DatabaseConnector


async def like_action(action_type: str, feedback_type: str):
    async with DatabaseConnector() as connector:
        await connector.add_feedback(action_type, feedback_type)

async def get_all_statistics():
    async with DatabaseConnector() as connector:
        stats = await connector.get_statistics()
        return stats
