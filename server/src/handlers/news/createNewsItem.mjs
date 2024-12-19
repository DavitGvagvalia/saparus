import { v4 as uuid } from "uuid"
import AWS from "aws-sdk"
import { db } from "../../util/db.mjs"

const s3 = new AWS.S3()

export const createNewsItem = async (event) => {
  try {
    const { title, text, images } = JSON.parse(event.body)

    const uploadedImages = await Promise.all(
      images.map(async (image, index) => {
        const imageBuffer = Buffer.from(image, "base64")
        const key = `news-items/${uuid()}-${index}`

        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: key,
          Body: imageBuffer,
          ContentType: "image/jpeg", // we will think about webp later
          ACL: "public-read",
        }

        await s3.upload(uploadParams).promise()

        return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`
      })
    )

    const newsItem = {
      id: uuid(),
      date: Date.now(),
      title,
      text,
      images: uploadedImages,
    }

    const params = {
      TableName: process.env.news_table,
      Item: newsItem,
    }

    await db.put(params).promise()

    return {
      statusCode: 201,
      body: JSON.stringify(newsItem),
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: error.message }),
    }
  }
}