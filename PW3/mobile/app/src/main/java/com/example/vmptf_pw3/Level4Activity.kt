package com.example.vmptf_pw3

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.vmptf_pw3.api.CreateRecipeRequest
import com.example.vmptf_pw3.api.RetrofitClient
import com.example.vmptf_pw3.models.Recipe
import kotlinx.coroutines.launch

class Level4Activity : AppCompatActivity() {

    private lateinit var editTitle: EditText
    private lateinit var editIngredients: EditText
    private lateinit var editInstructions: EditText
    private lateinit var editSearch: EditText
    private lateinit var spinnerIngredients: Spinner

    private lateinit var btnAddRecipe: Button
    private lateinit var btnSearch: Button
    private lateinit var btnClearFilters: Button

    private lateinit var recyclerRecipes: RecyclerView
    private lateinit var adapter: RecipeAdapter

    private val recipes = mutableListOf<Recipe>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_level4)

        editTitle = findViewById(R.id.editTitle)
        editIngredients = findViewById(R.id.editIngredients)
        editInstructions = findViewById(R.id.editInstructions)
        editSearch = findViewById(R.id.editSearch)
        spinnerIngredients = findViewById(R.id.spinnerIngredients)

        btnAddRecipe = findViewById(R.id.btnAddRecipe)
        btnSearch = findViewById(R.id.btnSearch)
        btnClearFilters = findViewById(R.id.btnClearFilters)

        recyclerRecipes = findViewById(R.id.recyclerRecipes)

        adapter = RecipeAdapter(recipes) { recipe ->
            deleteRecipe(recipe.id)
        }

        recyclerRecipes.layoutManager = LinearLayoutManager(this)
        recyclerRecipes.adapter = adapter

        loadAllRecipes()

        btnAddRecipe.setOnClickListener {
            addRecipe()
        }

        btnSearch.setOnClickListener {
            applyFilters()
        }

        btnClearFilters.setOnClickListener {
            editSearch.text.clear()
            spinnerIngredients.setSelection(0)
            loadAllRecipes()
        }
    }

    private fun loadAllRecipes() {
        lifecycleScope.launch {
            try {
                val data = RetrofitClient.api.getRecipes()

                adapter.updateData(data)
                updateIngredientSpinner(data)

            } catch (e: Exception) {
                Toast.makeText(
                    this@Level4Activity,
                    "Помилка завантаження: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    private fun applyFilters() {
        val searchText = editSearch.text.toString().trim()

        val selectedIngredient = spinnerIngredients.selectedItem?.toString()

        val ingredientFilter =
            if (selectedIngredient == null || selectedIngredient == "Усі інгредієнти") {
                null
            } else {
                selectedIngredient
            }

        lifecycleScope.launch {
            try {
                val data = RetrofitClient.api.getRecipes(
                    search = searchText.ifEmpty { null },
                    ingredient = ingredientFilter
                )

                adapter.updateData(data)

            } catch (e: Exception) {
                Toast.makeText(
                    this@Level4Activity,
                    "Помилка фільтрації: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    private fun updateIngredientSpinner(allRecipes: List<Recipe>) {
        val ingredients = mutableListOf("Усі інгредієнти")

        allRecipes.forEach { recipe ->
            recipe.ingredients.forEach { ingredient ->
                val normalized = ingredient.trim()

                if (
                    normalized.isNotEmpty() &&
                    !ingredients.contains(normalized)
                ) {
                    ingredients.add(normalized)
                }
            }
        }

        val spinnerAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            ingredients
        )

        spinnerAdapter.setDropDownViewResource(
            android.R.layout.simple_spinner_dropdown_item
        )

        spinnerIngredients.adapter = spinnerAdapter
    }

    private fun addRecipe() {
        val title = editTitle.text.toString().trim()

        val ingredients = editIngredients.text
            .toString()
            .split("\n")
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        val instructions = editInstructions.text.toString().trim()

        if (
            title.isEmpty() ||
            ingredients.isEmpty() ||
            instructions.isEmpty()
        ) {
            Toast.makeText(
                this,
                "Заповніть назву, інгредієнти та інструкцію",
                Toast.LENGTH_SHORT
            ).show()

            return
        }

        lifecycleScope.launch {
            try {
                val request = CreateRecipeRequest(
                    title = title,
                    ingredients = ingredients,
                    instructions = instructions
                )

                RetrofitClient.api.createRecipe(request)

                editTitle.text.clear()
                editIngredients.text.clear()
                editInstructions.text.clear()

                loadAllRecipes()

            } catch (e: Exception) {
                Toast.makeText(
                    this@Level4Activity,
                    "Помилка додавання: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    private fun deleteRecipe(id: Long) {
        lifecycleScope.launch {
            try {
                RetrofitClient.api.deleteRecipe(id)
                loadAllRecipes()

            } catch (e: Exception) {
                Toast.makeText(
                    this@Level4Activity,
                    "Помилка видалення: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
}