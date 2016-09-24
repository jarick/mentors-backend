
import { RestRequest } from './../../../lib/rest'

const serialize = (body) => {
  return {
    height: body.height,
    width: body.width,
    file_size: body.fileSize,
    src: body.src,
    original_name: body.originalName,
    description: body.description,
    directories: body.directories
  }
}

const schema = (id) => {
  return {
    "$async": true,
    "required": ["src"],
    "properties": {
      "height": {
        "type": "integer"
      },
      "width": {
        "type": "integer"
      },
      "fileSize" : {
        "type": "integer"
      },
      "contentType": {
        "type": "string",
        "maxLength": 255
      },
      "src": {
        "type": "string",
        "maxLength": 255,
        "unique": {"table": "files", "column": "src", "id": id},
        "format": "uri"
      },
      "originalName": {
        "type": "string",
        "maxLength": 255
      },
      "description": {
        "type": "string",
        "maxLength": 255
      },
      "directories": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "type": "string",
          "exists": {"table": "directories", "column": "name"}
        }
      }
    }
  }
}

const auth = () => true

export default RestRequest(auth, schema, serialize)