import React, { useState } from 'react';
import './App.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  // Course Types
  const [courseTypes, setCourseTypes] = useState([
    { id: 1, name: 'Individual' },
    { id: 2, name: 'Group' },
    { id: 3, name: 'Special' }
  ]);
  const [newCourseType, setNewCourseType] = useState('');
  const [editCourseTypeId, setEditCourseTypeId] = useState(null);
  const [editCourseTypeName, setEditCourseTypeName] = useState('');
  // Add state for error messages
  const [courseTypeError, setCourseTypeError] = useState('');
  const [courseError, setCourseError] = useState('');
  const [offeringError, setOfferingError] = useState('');
  const [studentError, setStudentError] = useState('');

  // Courses
  const [courses, setCourses] = useState([
    { id: 1, name: 'Hindi' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Urdu' }
  ]);
  const [newCourse, setNewCourse] = useState('');
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseName, setEditCourseName] = useState('');

  // Course Offerings
  const [offerings, setOfferings] = useState([]);
  const [selectedCourseTypeId, setSelectedCourseTypeId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editOfferingId, setEditOfferingId] = useState(null);
  const [editOfferingCourseTypeId, setEditOfferingCourseTypeId] = useState('');
  const [editOfferingCourseId, setEditOfferingCourseId] = useState('');

  // Student Registrations
  const [registrations, setRegistrations] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [selectedOfferingId, setSelectedOfferingId] = useState('');
  const [filterTypeId, setFilterTypeId] = useState('');

  // Course Types CRUD
  const addCourseType = () => {
    if (!newCourseType.trim()) {
      setCourseTypeError('Course type name is required');
      return;
    }
    if (courseTypes.some(ct => ct.name.toLowerCase() === newCourseType.trim().toLowerCase())) {
      setCourseTypeError('Course type already exists');
      return;
    }
    setCourseTypes([...courseTypes, { id: Date.now(), name: newCourseType }]);
    setNewCourseType('');
    setCourseTypeError('');
  };
  const startEditCourseType = (id, name) => {
    setEditCourseTypeId(id);
    setEditCourseTypeName(name);
  };
  const updateCourseType = () => {
    setCourseTypes(courseTypes.map(ct =>
      ct.id === editCourseTypeId ? { ...ct, name: editCourseTypeName } : ct
    ));
    setEditCourseTypeId(null);
    setEditCourseTypeName('');
  };
  const deleteCourseType = id => {
    setCourseTypes(courseTypes.filter(ct => ct.id !== id));
    setOfferings(offerings.filter(o => o.courseTypeId !== id));
  };

  // Courses CRUD
  const addCourse = () => {
    if (!newCourse.trim()) {
      setCourseError('Course name is required');
      return;
    }
    if (courses.some(c => c.name.toLowerCase() === newCourse.trim().toLowerCase())) {
      setCourseError('Course already exists');
      return;
    }
    setCourses([...courses, { id: Date.now(), name: newCourse }]);
    setNewCourse('');
    setCourseError('');
  };
  const startEditCourse = (id, name) => {
    setEditCourseId(id);
    setEditCourseName(name);
  };
  const updateCourse = () => {
    setCourses(courses.map(c =>
      c.id === editCourseId ? { ...c, name: editCourseName } : c
    ));
    setEditCourseId(null);
    setEditCourseName('');
  };
  const deleteCourse = id => {
    setCourses(courses.filter(c => c.id !== id));
    setOfferings(offerings.filter(o => o.courseId !== id));
  };

  // Offerings CRUD
  const addOffering = () => {
    if (!selectedCourseTypeId || !selectedCourseId) {
      setOfferingError('Select both type and course');
      return;
    }
    if (offerings.some(o => o.courseTypeId === Number(selectedCourseTypeId) && o.courseId === Number(selectedCourseId))) {
      setOfferingError('Offering already exists');
      return;
    }
    setOfferings([
      ...offerings,
      {
        id: Date.now(),
        courseTypeId: Number(selectedCourseTypeId),
        courseId: Number(selectedCourseId)
      }
    ]);
    setSelectedCourseTypeId('');
    setSelectedCourseId('');
    setOfferingError('');
  };
  const startEditOffering = (id, courseTypeId, courseId) => {
    setEditOfferingId(id);
    setEditOfferingCourseTypeId(courseTypeId);
    setEditOfferingCourseId(courseId);
  };
  const updateOffering = () => {
    setOfferings(offerings.map(o =>
      o.id === editOfferingId
        ? { ...o, courseTypeId: Number(editOfferingCourseTypeId), courseId: Number(editOfferingCourseId) }
        : o
    ));
    setEditOfferingId(null);
    setEditOfferingCourseTypeId('');
    setEditOfferingCourseId('');
  };
  const deleteOffering = id => {
    setOfferings(offerings.filter(o => o.id !== id));
    setRegistrations(registrations.filter(r => r.offeringId !== id));
  };

  // Student Registration
  const registerStudent = () => {
    if (!studentName.trim()) {
      setStudentError('Student name is required');
      return;
    }
    if (!selectedOfferingId) {
      setStudentError('Select an offering');
      return;
    }
    if (registrations.some(r => r.studentName.toLowerCase() === studentName.trim().toLowerCase() && r.offeringId === Number(selectedOfferingId))) {
      setStudentError('Student already registered for this offering');
      return;
    }
    setRegistrations([
      ...registrations,
      { id: Date.now(), studentName, offeringId: Number(selectedOfferingId) }
    ]);
    setStudentName('');
    setStudentError('');
  };

  // Filtered Offerings
  const filteredOfferings = filterTypeId
    ? offerings.filter(o => o.courseTypeId === Number(filterTypeId))
    : offerings;

  return (
    <Box className="app-main">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Typography variant="h3" align="center" gutterBottom>Course Management</Typography>
      </motion.div>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} className="section">
        {/* Course Types */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Course Types</Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <TextField
                  value={newCourseType}
                  onChange={e => setNewCourseType(e.target.value)}
                  label="New course type"
                  size="small"
                  fullWidth
                  error={!!courseTypeError}
                  helperText={courseTypeError}
                />
                <Button variant="contained" onClick={addCourseType}>Add</Button>
              </Stack>
              <List>
                <AnimatePresence>
                  {courseTypes.map(ct => (
                    <motion.div
                      key={ct.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ListItem secondaryAction={
                        editCourseTypeId === ct.id ? (
                          <>
                            <IconButton edge="end" color="primary" onClick={updateCourseType}><SaveIcon /></IconButton>
                            <IconButton edge="end" color="secondary" onClick={() => setEditCourseTypeId(null)}><CancelIcon /></IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton edge="end" color="primary" onClick={() => startEditCourseType(ct.id, ct.name)}><EditIcon /></IconButton>
                            <IconButton edge="end" color="error" onClick={() => deleteCourseType(ct.id)}><DeleteIcon /></IconButton>
                          </>
                        )
                      }>
                        {editCourseTypeId === ct.id ? (
                          <TextField
                            value={editCourseTypeName}
                            onChange={e => setEditCourseTypeName(e.target.value)}
                            size="small"
                            sx={{ mr: 2 }}
                          />
                        ) : (
                          <ListItemText primary={ct.name} />
                        )}
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </CardContent>
          </Card>
        </motion.div>
        {/* Courses */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Courses</Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <TextField
                  value={newCourse}
                  onChange={e => setNewCourse(e.target.value)}
                  label="New course"
                  size="small"
                  fullWidth
                  error={!!courseError}
                  helperText={courseError}
                />
                <Button variant="contained" onClick={addCourse}>Add</Button>
              </Stack>
              <List>
                <AnimatePresence>
                  {courses.map(c => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ListItem secondaryAction={
                        editCourseId === c.id ? (
                          <>
                            <IconButton edge="end" color="primary" onClick={updateCourse}><SaveIcon /></IconButton>
                            <IconButton edge="end" color="secondary" onClick={() => setEditCourseId(null)}><CancelIcon /></IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton edge="end" color="primary" onClick={() => startEditCourse(c.id, c.name)}><EditIcon /></IconButton>
                            <IconButton edge="end" color="error" onClick={() => deleteCourse(c.id)}><DeleteIcon /></IconButton>
                          </>
                        )
                      }>
                        {editCourseId === c.id ? (
                          <TextField
                            value={editCourseName}
                            onChange={e => setEditCourseName(e.target.value)}
                            size="small"
                            sx={{ mr: 2 }}
                          />
                        ) : (
                          <ListItemText primary={c.name} />
                        )}
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </CardContent>
          </Card>
        </motion.div>
        {/* Course Offerings */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Course Offerings</Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <FormControl fullWidth size="small" error={!!offeringError}>
                  <InputLabel>Select Type</InputLabel>
                  <Select
                    value={selectedCourseTypeId}
                    label="Select Type"
                    onChange={e => setSelectedCourseTypeId(e.target.value)}
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    {courseTypes.map(ct => (
                      <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
                    ))}
                  </Select>
                  {offeringError && <Typography color="error" variant="caption">{offeringError}</Typography>}
                </FormControl>
                <FormControl fullWidth size="small" error={!!offeringError}>
                  <InputLabel>Select Course</InputLabel>
                  <Select
                    value={selectedCourseId}
                    label="Select Course"
                    onChange={e => setSelectedCourseId(e.target.value)}
                  >
                    <MenuItem value="">Select Course</MenuItem>
                    {courses.map(c => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                  {offeringError && <Typography color="error" variant="caption">{offeringError}</Typography>}
                </FormControl>
                <Button variant="contained" onClick={addOffering}>Add</Button>
              </Stack>
              <List>
                <AnimatePresence>
                  {offerings.map(o => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ListItem secondaryAction={
                        editOfferingId === o.id ? (
                          <>
                            <IconButton edge="end" color="primary" onClick={updateOffering}><SaveIcon /></IconButton>
                            <IconButton edge="end" color="secondary" onClick={() => setEditOfferingId(null)}><CancelIcon /></IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton edge="end" color="primary" onClick={() => startEditOffering(o.id, o.courseTypeId, o.courseId)}><EditIcon /></IconButton>
                            <IconButton edge="end" color="error" onClick={() => deleteOffering(o.id)}><DeleteIcon /></IconButton>
                          </>
                        )
                      }>
                        {editOfferingId === o.id ? (
                          <>
                            <FormControl size="small" sx={{ mr: 1, minWidth: 120 }}>
                              <Select
                                value={editOfferingCourseTypeId}
                                onChange={e => setEditOfferingCourseTypeId(e.target.value)}
                              >
                                {courseTypes.map(ct => (
                                  <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ mr: 1, minWidth: 120 }}>
                              <Select
                                value={editOfferingCourseId}
                                onChange={e => setEditOfferingCourseId(e.target.value)}
                              >
                                {courses.map(c => (
                                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </>
                        ) : (
                          <ListItemText primary={`${courseTypes.find(ct => ct.id === o.courseTypeId)?.name} - ${courses.find(c => c.id === o.courseId)?.name}`} />
                        )}
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </Stack>
      {/* Filter Offerings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="section" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Available Course Offerings</Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <InputLabel>Filter by Course Type:</InputLabel>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select value={filterTypeId} onChange={e => setFilterTypeId(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {courseTypes.map(ct => (
                    <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <List>
              <AnimatePresence>
                {filteredOfferings.map(o => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ListItem>
                      <ListItemText primary={`${courseTypes.find(ct => ct.id === o.courseTypeId)?.name} - ${courses.find(c => c.id === o.courseId)?.name}`} />
                    </ListItem>
                  </motion.div>
                ))}
                {filteredOfferings.length === 0 && <ListItem><ListItemText primary="No offerings available." /></ListItem>}
              </AnimatePresence>
            </List>
          </CardContent>
        </Card>
      </motion.div>
      {/* Student Registration */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="section" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Student Registration</Typography>
            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                label="Student Name"
                size="small"
                sx={{ minWidth: 200 }}
                error={!!studentError}
                helperText={studentError}
              />
              <FormControl size="small" sx={{ minWidth: 220 }} error={!!studentError}>
                <InputLabel>Select Offering</InputLabel>
                <Select
                  value={selectedOfferingId}
                  label="Select Offering"
                  onChange={e => setSelectedOfferingId(e.target.value)}
                >
                  <MenuItem value="">Select Offering</MenuItem>
                  {offerings.map(o => (
                    <MenuItem key={o.id} value={o.id}>
                      {courseTypes.find(ct => ct.id === o.courseTypeId)?.name} - {courses.find(c => c.id === o.courseId)?.name}
                    </MenuItem>
                  ))}
                </Select>
                {studentError && <Typography color="error" variant="caption">{studentError}</Typography>}
              </FormControl>
              <Button variant="contained" onClick={registerStudent}>Register</Button>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
      {/* Registered Students */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="section">
          <CardContent>
            <Typography variant="h5" gutterBottom>Registered Students</Typography>
            {selectedOfferingId ? (
              <List>
                <AnimatePresence>
                  {registrations
                    .filter(r => r.offeringId === Number(selectedOfferingId))
                    .map(r => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ListItem>
                          <ListItemText primary={r.studentName} />
                        </ListItem>
                      </motion.div>
                    ))}
                  {registrations.filter(r => r.offeringId === Number(selectedOfferingId)).length === 0 && (
                    <ListItem><ListItemText primary="No students registered." /></ListItem>
                  )}
                </AnimatePresence>
              </List>
            ) : (
              <Typography color="text.secondary">Select an offering to view registered students.</Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default App;
