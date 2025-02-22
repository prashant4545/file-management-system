
#!/bin/bash
# Login API 
curl -X POST 'http://localhost:3000/api/auth/login' \
-H 'Content-Type: application/json' \
-d '{"username": "testuser", "password": "password123"}'


# 1. GET /documents/:id (Get Document Details)
curl -X GET 'http://localhost:3000/documents/1234567890abcdef' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: application/json'

# 2. POST /documents (Create New Document)
curl -X POST 'http://localhost:3000/documents' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: multipart/form-data' \
-F 'title=My New Document' \
-F 'content=This is the content of the document' \
-F 'folder=folderId' \
-F 'file=@/path/to/your/file.pdf'

# 3. POST /documents/:id/version (Create Document Version)
curl -X POST 'http://localhost:3000/documents/1234567890abcdef/version' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: multipart/form-data' \
-F 'versionNumber=1.1' \
-F 'file=@/path/to/your/file_v1.1.pdf'

# 4. GET /documents/:id/versions (Get All Document Versions)
curl -X GET 'http://localhost:3000/documents/1234567890abcdef/versions' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: application/json'

# 5. PUT /documents/:id (Update Document Details)
curl -X PUT 'http://localhost:3000/documents/1234567890abcdef' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: application/json' \
-d '{"title": "Updated Document Title", "content": "Updated Document Content"}'

# 6. DELETE /documents/:id (Delete Document)
curl -X DELETE 'http://localhost:3000/documents/1234567890abcdef' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: application/json'

# 7. GET /filter (Search Documents by Title or Content)
curl -X GET 'http://localhost:3000/documents/filter?search=Document Title' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: application/json'

# 8. GET /total-documents (Get Total Documents Count)
curl -X GET 'http://localhost:3000/documents/total-documents' \
-H 'Authorization: Bearer <your-jwt-token>' \
-H 'Content-Type: application/json'

