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
