from pydantic import BaseModel,EmailStr

class User(BaseModel):
    emailAddress:str
    password:str

