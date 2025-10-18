"""
Copyright (C) 2024 Everett N. Christman / The Christman AI Project
All Rights Reserved.

PROPRIETARY AND CONFIDENTIAL

This file is part of The Christman AI Project and contains proprietary
technology and trade secrets. Unauthorized copying, distribution, modification,
public display, or public performance of this file, via any medium, is strictly
prohibited.

No license is granted to any person or entity. All rights are reserved by
Everett N. Christman and The Christman AI Project.

For licensing inquiries: contact@christmanai.com
"""

from fastapi import FastApi

app = FastApi()

@app.get("/")
def root():
    return {"message": "TraumaHealer backend live"}
