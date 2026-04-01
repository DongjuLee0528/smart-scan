import json


def lambda_handler(event, context):
    print("Chatbot skill server Lambda invoked")
    print(json.dumps({"event": event}, default=str))

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(
            {
                "service": "chatbot-skill-server",
                "message": "Chatbot skill server Lambda is running.",
            }
        ),
    }
