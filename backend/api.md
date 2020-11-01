# University Admissions DB API documentation

## Fetching applications
> HTTP: `GET /api/applications`   
> Admin required: No  

This endpoint returns a list of application objects.
The properties returned differ depending on whether the caller has administrator permissions.

### Example response
```json
{
  "data": [{
      "id": 2,
      "comment": "",
      "informant": "",
      "dateInformed": null,
      "status": "Offered - Declined",
      "Major": {
        "majorName": "Accountancy & Business",
        "category": "Unknown"
      },
      "Student": {
        "studentId": "2012a001",
        "gradCap": "4.5"
      },
      "University": {
        "uniName": "Nanyang Technological University",
        "country": "Unknown"
      }
  }],
  "offset": 0,
  "count": 11113
}
```
**Important**  
The `comment`, `informant`, `dateInformed` fields are only returned if the caller has administrator permissions.

### Pagination
Query parameters:  
```
limit: int   
Range: [0, 50] 
Default: 10

offset: int
Range: >=0
Default: 0
```
Offsets greater than `count` will return an empty data array.  
Limits greater than 50 will return at most 50 items.

### Sorting
Query parameters:  
```
sortBy: List<{
    param: string,
    order: "desc"|"asc"
}>
```
For a full list of sort parameters, see [columns.ts](./src/utils/columns.ts)  
Sort parameters are processed in order of appearance in URL.  
Omission of `param` or `order` will cause an error to be thrown.  
#### Example
```
sortBy[0][param]=uniName&
sortBy[0][order]=desc&
sortBy[1][param]=id&
sortBy[1][order]=desc
```
will sort first by `uniName` in descending order, then `id` in descending order.

### Filtering
Query parameters:  
```
filter: {
  [columnName: string]: string[]
}
```
For a full list of filter parameters, see [columns.ts](./src/utils/columns.ts)  
#### Example
```
filter[uniId][0]=28&
filter[gradCap][0]=5&
filter[gradCap][1]=4.5
```
will show students who applied to NUS with a CAP of 5.0 or 4.5.

## Fetching universities
> HTTP: `GET /api/universities`   
> Admin required: No

Returns a list of universities  
Example response:
```
[
  {
    "uniId": 1,
    "uniName": "Unknown",
    "country": "Unknown"
  },
  {
    "uniId": 2,
    "uniName": "Massachusetts Institute of Technology",
    "country": "USA"
  }
]
```

## Fetching majors
> HTTP: `GET /api/majors`   
> Admin required: No

Returns a list of majors  
Specify the `uniId` parameter to filter by university ID.   
Example response:
```
[
  {
    "majorId": 1,
    "majorName": "Business Admin (Accountancy) & Communications & New Media",
    "category": "Unknown",
    "uniId": 28
  },
  {
    "majorId": 20,
    "majorName": "Computer Science",
    "category": "Unknown",
    "uniId": 28
  }
]
```

## Fetching summary of data
> HTTP: `GET /api/summary`   
> Admin required: No

Returns a list of values for each application column.  
Has the same filter syntax as `/api/applications`.  
Use `exclude`/`include` query parameters to only return certain fields.  
`..` indicates ranges.  
For example, `[1,"..",5]` is equivalent to `[1,2,3,4,5]`.  
Example response:
```
{
    "years": [2011,"..",2020],
    "caps":[30,"..",50],
    "studentIds": [
        {
            "year":"2011",
            "ids":[1,"..",300]
        }
    ],
    "majors": [1,"..",100],
    "universities: [1,"..",100],
    "countries": ["USA","New Zealand","Singapore"],
    "statuses":["Offered - Accepted", "Rejected - Final"],
    "categories":["Business", "Computing", "Biology"]
}
```
Note: `caps` are multiplied by 10 to avoid floating-point errors.


## Creating applications
> HTTP: `POST /api/admin/applications/create`   
> Admin required: Yes

Form data:
```
"studentId": string,
"universityId":  int,
"majorId": int,
"status":  string,
"informant": string = "",
"dateInformed":date = null,
"comment": string = "",
```
`studentId` must match `/20[0-9]{2}a[0-9]{3}/` and map to a valid student in the database.  

## Creating students
> HTTP: `POST /api/admin/students/create`   
> Admin required: Yes

Form data:
```
"studentId": string,
"gradCap": double
```
`studentId` must match `/20[0-9]{2}a[0-9]{3}/`  
`gradCap` must be in the range `[0, 5]`

