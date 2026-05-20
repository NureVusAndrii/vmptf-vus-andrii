package com.example.vmptf_pw3.api

import com.example.vmptf_pw3.models.Recipe
import retrofit2.Response
import retrofit2.http.*

interface RecipeApi {

    @GET("recipes")
    suspend fun getRecipes(
        @Query("search") search: String? = null,
        @Query("ingredient") ingredient: String? = null
    ): List<Recipe>

    @POST("recipes")
    suspend fun createRecipe(
        @Body recipe: CreateRecipeRequest
    ): Recipe

    @DELETE("recipes/{id}")
    suspend fun deleteRecipe(
        @Path("id") id: Long
    ): Response<Unit>
}