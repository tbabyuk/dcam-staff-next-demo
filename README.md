# Contractor Work Hours App (An app for letting contractors log their work hours)

See it live: [Contractor Work Hours App](https://dcam-staff-next-demo.vercel.app/)  

###
Login Credentials for demo:  
Demo 1:  
Email: **demo1@gmail.com**  
Pass: **demo111**  
Demo 2:  
Email: **demo2@gmail.com**  
Pass: **demo222**  
Demo 3:  
Email: **demo3@gmail.com**  
Pass: **demo333**  
Demo 4:    
Email: **demo4@gmail.com**  
Pass: **demo444**  
Demo 5:  
Email: **demo5@gmail.com**  
Pass: **demo555**

## Technologies
This project was made with:
* Next.js
* React & Node.js
* Tailwind CSS
* NextAuth
* MongoDB (including aggregation pipeline)
* Nodemailer

## Short Description
A web app used by the teachers (contractors) of a music school business to log their work hours for purposes of pay.

## Long Description
This app allows teachers to log in and record their student attendance for the previous two weeks. Here is how this information translates to pay:  
* if a student is marked "present", it means the lesson took place and the teacher is owed pay for this lesson
* if a student is marked "absent", it means that the lesson did not take place (with timely notice) and the teacher is not owed pay for this lesson
* if a student is marked "absent (counted)", it means that the lesson did not take place but the lesson cancellation was either late or was not made, so the teacher still gets paid  

This information is needed by the school administration to know how much pay the teachers are owed. When teachers submit their attendance, the admin is notified of this via an automatic email (using Nodemailer) and can also see it and other details of the submission in their admin app (See my other project - Office Admin App).

## Background & Motivation
This was a practical app created for a music school business. The goal here was to get the contractors (teachers) to log their own hours instead of the admin doing it for them. This helped save a lot of time for the school admin and freed them up to focus on other things.

## State of Completion
Completed and actively being used by the school's teachers.

## Learning Lessons & Challenges
### Database submission logic
The biggest challenge in this app was probably the logic for checking attendance status and redirecting the user to the correct page. This was done by making the appropriate call to the MongoDB database depending on what page the user is currently on. For example, if the user is on "/attendance/week1", a call is made to MongoDB to check the teacher's current attendance status. If the attendance for the upcoming pay period was already submitted, the teacher will be redirected to the "/attendance/completed" page. Or, if week 1 attendance was already submitted but week 2 was not, the teacher is redirected to the "/attendance/week2" page. Similar check is performed on the "/attendance/week2" and "/attendance/completed" pages.

### Attendance form row logic for calculating the running total pay
I enjoyed the challenge of figuring out the logic for the attendance form, where I needed to make sure that if the teacher chooses "present", from the select tag, the lesson amount is added to the total. If they then change their mind and "absent", the lesson amount is subtracted from the total. And if they select "present (counted)", the amount is added as well. This was trickier to implement than it sounds, but I was very happy with the result. Here is the logic I ended up with:  

    `if(!attendanceSelected && (value === "present" || value === "counted")) {
      setAttendanceSelected(true)
      setTotal((prev) => prev + student.pay)
    }
    if(attendanceSelected && value === "absent") {
      setAttendanceSelected(false)
      setTotal((prev) => prev - student.pay)
    }
    if(!attendanceSelected && value === "absent") {
      setTotal((prev) => prev - 0)
    }`

### Calculating the final total pay with MongoDB
The final (total) amount that teachers are owed was calculated by using what is called an "aggregation pipeline" in MongoDB. This was completely new to me as I had never performed such a complex query with MongoDB, but I enjoyed the challenge of researching and figuring it out, and it made me appreciate the power of MongoDB as a database even more. The code for this aggregation pipeline was as follows:

    `{
        $match: {
            teacher: teacher,
        }
    },
    {
        $group: {
            _id: null,
            totalPayWeek1: {
            $sum: {
                // $cond: [{ $eq: ["$attendance.week1", "present"] }, "$pay", 0]
                $cond: {
                if: {
                    $or: [
                    { $eq: ["$attendance.week1", "present"] },
                    { $eq: ["$attendance.week1", "counted"] }
                    ]
                },
                then: "$pay",
                else: 0
                }
            }
            },
            totalPayWeek2: {
            $sum: {
                // $cond: [{ $eq: ["$attendance.week2", "present"] }, "$pay", 0]
                $cond: {
                if: {
                    $or: [
                    { $eq: ["$attendance.week2", "present"] },
                    { $eq: ["$attendance.week2", "counted"] }
                    ]
                },
                then: "$pay",
                else: 0
                }
            }
            }
        }
    }`


## Summary
Building this app taught me many new things and I am looking forward to continuing to push my boundaries even further!