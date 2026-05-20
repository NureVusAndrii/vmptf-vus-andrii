package com.example.vmptf_pw3.api

data class CreateRecipeRequest(
    val title: String,
    val ingredients: List<String>,
    val instructions: String
)
