const express = require("express");
const router = express.Router();
const fetchuser = require('../middleware/getuser')
const Projects = require('../models/Projects')


// get all the projects using: GET "/api/projects/getprojects" , login required 
router.get('/getprojects', fetchuser, async (req, res) => {
    const projects = await Projects.find({ user: req.user.id })
    res.json(projects)
})


// submit a project using: POST "/api/projects/addprojects" , login required 
router.post('/addproject', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body
        const project = new Projects({
            title, description, tag, user: req.user.id
        })
        await project.save()
        res.json(project)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }
})

// deleting a project using: DELETE "/api/projects/delproject" , login required
router.delete('/delproject/:id', fetchuser, async (req, res) => {
    try {
        // finds the project to be deleted by id 
        let project = await Projects.findById(req.params.id);
        if (!project) {
            return res.status(404).send("Project not found");
        }

        // checks for user 
        if (project.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        await Projects.findByIdAndDelete(req.params.id);
        res.json({ "status": "Project deleted successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }
});



module.exports = router