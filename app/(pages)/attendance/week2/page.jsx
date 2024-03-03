"use client"

import { AttendanceForm } from "../../../components/AttendanceForm"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"



const WeekTwoAttendancePage = () => {


  const router = useRouter()
  const {data: session} = useSession()
  const [students, setStudents] = useState([])
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")


  useEffect(() => {

    const fetchStudents = async () => {
        
      try {
          const res = await fetch("/api/get-students", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({teacher: session.user.name.toLowerCase()})
          })
              const data = await res.json()
              setStudents([...data])
          } catch (error) {
              console.log("Error fetching students:", error)
          }
    }


    const checkAttendanceStatus = async () => {
      try {
        const res = await fetch("/api/check-meta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({teacher: session.user.name.toLowerCase()})
        })
            const result = await res.json()

            if(result[0].week1Submitted && result[0].week2Submitted) {
                router.push("/attendance/completed")
                return;
            } else if (!result[0].week1Submitted) {
                setErrorMessage("Please submit Week 1 attendance first. Redirecting to Week 1...")
                setTimeout(() => {router.push("/attendance/week1")}, 3000)
                return;
            }

            fetchStudents()


        } catch (error) {
            console.log("Error fetching meta data:", error)
        }

    }

    checkAttendanceStatus()

  }, [session])

  return (
    <main className="md:px-24 pt-6">
        <p className="text-center mb-6">
            {successMessage && (<span className="text-green-500">{successMessage}</span>)}
            {errorMessage && (<span className="text-red-500">{errorMessage}</span>)}
        </p>
        <AttendanceForm students={students} />
    </main>
  )
}

export default WeekTwoAttendancePage