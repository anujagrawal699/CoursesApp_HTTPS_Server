const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    next();
  }
  else {
    res.status(403).json({ message: "Admin Authentication Failed!" });

  }
};
const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const user = USERS.find(u => u.username === username && u.password === password)
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: "User Authetication Failed!" });
  }
};
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin created successfully" });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const admin = req.body;
  const adminlog = ADMINS.find(a => a.username === admin.username && a.password === admin.password);
  if (adminlog) {
    res.json({ message: "Logged in successfully" });
  } else {
    res.status(404).json({ message: "Wrong Username or Password" })
  }

});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated successfully" });

  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  USERS.push(user);
  res.json({ message: "User created successfully" });
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully" });
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const filteredCourses = COURSES.filter(c => c.published);
  res.json({ courses: filteredCourses });

});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchasedCourses;[1, 4];
  var purchasedCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
