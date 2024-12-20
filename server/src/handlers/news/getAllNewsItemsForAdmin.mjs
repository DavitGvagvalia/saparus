import { db } from "../../util/db.mjs"

export const getAllNewsItemForAdmin = async (event) => {
  try {
    const { limit, page } = event.queryStringParameters

    const params = {
      TableName: process.env.NEWS_TABLE,
    }

    const { Items: newsItems } = await db.scan(params).promise()

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResult = newsItems.slice(startIndex, endIndex)

    if (!newsItems || newsItems.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No items found" }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        news: paginatedResult,
        pagination: {
          currentPage: page,
          hasNextPage: endIndex < newsItems.length,
          totalNewsArticles: newsItems.length,
          totalPages: Math.ceil(newsItems.length / limit),
        },
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}
