
const debug = require('debug')('cli')
const mysql = require('mysql')

//unique
//foreign key
export default function (cfg, table, model, cb) {
  const connection = mysql.createConnection(cfg.mysql)
  connection.connect();
  connection.query('SHOW COLUMNS FROM `' + table + '`', (err, rows) => {
    if (err) throw err;
    let json = {
      "$async": true,
      properties: {}
    }
    let props = []
    let fields = []
    for (const row of rows) {
      const secures = ['id', 'created_at', 'updated_at', 'uuid']
      if(secures.indexOf(row.Field) !== -1) continue
      let type = /(\w+)\((.+)\)/.exec(row['Type'])
      if (!type) {
        type = /(\w+)/.exec(row['Type'])
      }
      if (row.Null === "NO") {
        if (!json.required) {
          json.required = []
        }
        json.required.push(row.Field)
      }
      if (type) {
        switch (type[1]) {
          case 'int':
            json.properties[row.Field] = {
              type: "integer",
              format: "int32"
            }
            props.push(row.Field + ': ' + ((row.Null === 'YES') ? '?' : '') + 'number')
            fields.push(row.Field)
            break
          case 'varchar':
            json.properties[row.Field] = {
              type: "string",
              maxLength: parseInt(type[2])
            }
            props.push(row.Field + ': ' + ((row.Null === 'YES') ? '?' : '') + 'string')
            fields.push(row.Field)
            break
          case 'tinyint':
            json.properties[row.Field] = {
              type: "boolean"
            }
            props.push(row.Field + ': ' + ((row.Null === 'YES') ? '?' : '') + 'boolean')
            fields.push(row.Field)
            break
          case 'datetime':
            json.properties[row.Field] = {
              type: "string",
              format: "date-time"
            }
            props.push(row.Field + ': ' + ((row.Null === 'YES') ? '?' : '') + 'DateTime')
            fields.push(row.Field)
            break
          case 'date':
            json.properties[row.Field] = {
              type: "string",
              format: "date"
            }
            props.push(row.Field + ': ' + ((row.Null === 'YES') ? '?' : '') + 'DateTime')
            fields.push(row.Field)
            break
          case 'enum':
            json.properties[row.Field] = {
              enum: type[2].split(',').map(item => item.trim())
            }
            props.push(row.Field + ': ' + ((row.Null === 'YES') ? '?' : '') + 'string')
            fields.push(row.Field)
            break
          case 'text':
            json.properties[row.Field] = {
              type: "string",
            }
            props.push(row.Field + ': ' + ((row.Null === 'YES') ? '?' : '') + 'string')
            fields.push(row.Field)
            break
        }
      }
    }
    const data = {
      entity: model,
      model: model.toLowerCase(),
      table: table,
      json: json,
      props: props,
      fields: fields
    }
    cb(data)
  });
  connection.end();
}