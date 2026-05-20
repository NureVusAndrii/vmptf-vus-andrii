package com.example.vmptf_pw3

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.vmptf_pw3.models.Recipe

class RecipeAdapter(
    private val recipes: MutableList<Recipe>,
    private val onDelete: (Recipe) -> Unit
) : RecyclerView.Adapter<RecipeAdapter.RecipeViewHolder>() {

    inner class RecipeViewHolder(view: View)
        : RecyclerView.ViewHolder(view) {

        val textTitle: TextView =
            view.findViewById(R.id.textTitle)

        val textIngredients: TextView =
            view.findViewById(R.id.textIngredients)

        val textInstructions: TextView =
            view.findViewById(R.id.textInstructions)

        val btnDelete: Button =
            view.findViewById(R.id.btnDeleteRecipe)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): RecipeViewHolder {

        val view = LayoutInflater
            .from(parent.context)
            .inflate(
                R.layout.item_recipe,
                parent,
                false
            )

        return RecipeViewHolder(view)
    }

    override fun getItemCount(): Int =
        recipes.size

    override fun onBindViewHolder(
        holder: RecipeViewHolder,
        position: Int
    ) {

        val recipe = recipes[position]

        holder.textTitle.text =
            recipe.title

        holder.textIngredients.text =
            "Інгредієнти:\n" +
                    recipe.ingredients.joinToString("\n")

        holder.textInstructions.text =
            "Вказівки:\n${recipe.instructions}"

        holder.btnDelete.setOnClickListener {

            onDelete(recipe)
        }
    }

    fun updateData(newRecipes: List<Recipe>) {

        recipes.clear()

        recipes.addAll(newRecipes)

        notifyDataSetChanged()
    }
}