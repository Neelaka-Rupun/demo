const AWS = require("aws-sdk");
const { v4 } = require("uuid"); ;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "BookDetailsTable";

export const createBook = async (event) => {
  const reqBody = JSON.parse(event.body);

  const product = {
    bookId: v4(),
    ...reqBody,
  };

  await docClient
    .put({
      TableName: tableName,
      Item: product,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(product),
  };
};

export const getBook = async (event) => {
  const id = event.pathParameters?.id;

  const bookData = await docClient
    .get({
      TableName: tableName,
      Key: {
        bookId: id,
      },
    })
    .promise();

  if (!bookData.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "not found" }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(bookData),
  };
};
