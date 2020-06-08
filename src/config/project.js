/**
 *          .::PROJECT CONFIGURATION::.
 * Project configuration and all project's information are defined here.
 * 
 */
let Project = {

    Name: "togetherBox",
    Description: "A box for being together",
    Notes: ["Some Notes to think", "List of works to do", ]

}
let DevProjectInfoKeys = [
    "Notes",
    //Add Key names that shouldn't appear in production mode
]
if (process.env.projectMode == "Production") {
    Project = _.omit(Project, DevProjectInfoKeys)
}
export default Project;