from fastapi.responses import StreamingResponse
from fastapi import UploadFile
from typing import List
from databases.database_connector import DatabaseConnector
from io import BytesIO
import httpx
from config import GENERATE_AVATAR_URL

async def generate_avatar_from_saved_photo(clothing: List[UploadFile], username: str):
    async with DatabaseConnector() as connector:
        '''
        existing_avatar = await connector.get_saved_avatar(username)
        if existing_avatar:
            return StreamingResponse(BytesIO(existing_avatar), media_type="image/jpeg", headers={
                "Content-Disposition": f"attachment; filename=avatar.jpg"
            })
        '''
        face_photo_bytes = await connector.get_user_photo(username)

    files = {
        "face": ("face.jpg", BytesIO(face_photo_bytes), "image/jpeg")
    }

    for i, cloth in enumerate(clothing):
        content = await cloth.read()
        files[f"clothing"] = (cloth.filename, BytesIO(content), cloth.content_type)

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            GENERATE_AVATAR_URL,
            files=files
        )
        response.raise_for_status()
        avatar_bytes = await response.aread()

    '''
    async with DatabaseConnector() as connector:
        await connector.save_avatar(username, avatar_bytes)
    '''

    return StreamingResponse(BytesIO(avatar_bytes), media_type="image/jpeg", headers={
        "Content-Disposition": f"attachment; filename=avatar.jpg"
    })
