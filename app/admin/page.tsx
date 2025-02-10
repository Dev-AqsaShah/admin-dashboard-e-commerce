"use client"
import { useRouter} from "next/navigation";
import React, { useState } from "react";

export default function adminLogin(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    const handleLogin = (e : React.FormEvent) => {
        e.preventDefault()
    }
    if(email === "aqsashah000000@gmail.com") {
        
    }
}