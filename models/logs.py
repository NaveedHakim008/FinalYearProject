from pydantic import BaseModel

class logs(BaseModel):
    detected_person_id:str
    camera_no:int
