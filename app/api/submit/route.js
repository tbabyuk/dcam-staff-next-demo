import { connectToStaffDB } from "@/db/database";
import { NextResponse } from "next/server";
import { Student, Meta } from "@/models/models";

export const POST = async (request) => {
    

    const {attendance, teacher, week, payday} = await request.json()

    console.log("logging request from /submit API:", attendance, teacher, week, payday)

    const getKey = () => {
        if(week === "week1Submitted") {
            return "attendance.week1"
        } else {
            return "attendance.week2"
        }
    }

    console.log("from submit API:", Object.entries(attendance))

    
    try {
        await connectToStaffDB();

        Object.entries(attendance).forEach( async ([key, value]) => {
            await Student.updateOne({"teacher": teacher, "name": key },
                                    {$set: {[getKey()]: value}})
        })

        await Meta.updateOne({"teacher": teacher}, {$set: {[week]: true, "payday": payday}})
        
        console.log("Week 1 submission updated successfully.");

        return NextResponse.json({message: "success"}, {status: 200})

    } catch (error) {
        return NextResponse.json({message: "Failed to submit attendance"}, {status: 500})
    }
}

