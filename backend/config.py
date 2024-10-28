# Return codes
UNAUTHORIZED = ("UNAUTHORIZED", 401)
REQ_OK = ("REQ OK", 201)
AUTH_RESP_OK = ({"response": "OK"}, 200)
AUTH_RESP_REJECT = ({"response": "REJECT"}, 200)

db_config = {
    "host": "home_db",
    "port": "3306",
    "user": "root",
    "password": "password",
    "database": "home_db",
}
