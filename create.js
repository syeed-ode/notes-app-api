import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


// const dynamoDb = new AWS.DynamoDB.DocumentClient();
// Refactored to ./libs/dynamodb-lib


export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "userTable",
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  
  try {
    // We are also using the async/await pattern
    // here to refactor our Lambda function. This
    // allows us to return once we are done
    // processing; instead of using the callback
    // function.
    await dynamoDbLib.call("put", params);
    
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
  
  // Removed and refactored to ./dynamodb-lib
  //dynamoDb.put(params, (error, data) => {
  //  // Set response headers to enable CORS (Cross-Origin Resource Sharing)
  //  const headers = {
  //    "Access-Control-Allow-Origin": "*",
  //    "Access-Control-Allow-Credentials": true
  //  };
  //
  //  // Return status code 500 on error
  //  if (error) {
  //    const response = {
  //      statusCode: 500,
  //      headers: headers,
  //      body: JSON.stringify({ status: false })
  //    };
  //    callback(null, response);
  //    return;
  //  }
  //
  //  // Return status code 200 and the newly created item
  //  const response = {
  //    statusCode: 200,
  //    headers: headers,
  //    body: JSON.stringify(params.Item)
  //  };
  //  callback(null, response);
  //});

}
