import TableColumn from "../types/table-column";
import Application from "../models/Application";

export default [
  new TableColumn(
    "uniName",
    Application.associations.University,
    false
  ),

  new TableColumn(
    "country",
    Application.associations.University,
    false
  ),
  new TableColumn(
    "studentId",
    Application.associations.Student,
    false
  ),
  new TableColumn(
    "gradCap",
    Application.associations.Student,
    false
  ),
    new TableColumn(
    "majorName",
    Application.associations.Major,
    false
  ),
    new TableColumn(
    "category",
    Application.associations.Major,
    false
  ),
  new TableColumn(
    "comment",
    null,
    true
  ),
    new TableColumn(
    "informant",
    null,
    true
  ),
      new TableColumn(
    "dateInformed",
    null,
    true
  ),
]
