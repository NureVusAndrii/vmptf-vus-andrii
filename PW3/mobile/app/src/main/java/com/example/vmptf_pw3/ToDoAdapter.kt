package com.example.vmptf_pw3

import android.graphics.Paint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.CheckBox
import androidx.recyclerview.widget.RecyclerView
import com.example.vmptf_pw3.models.Task

class ToDoAdapter(
    private val tasks: MutableList<Task>,
    private val onDataChanged: () -> Unit
) : RecyclerView.Adapter<ToDoAdapter.TaskViewHolder>() {

    inner class TaskViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val checkTask: CheckBox = view.findViewById(R.id.checkTask)
        val btnDelete: Button = view.findViewById(R.id.btnDelete)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_task, parent, false)

        return TaskViewHolder(view)
    }

    override fun getItemCount(): Int = tasks.size

    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {

        val task = tasks[position]

        holder.checkTask.text = task.title
        holder.checkTask.isChecked = task.isDone

        updateStrikeThrough(holder.checkTask, task.isDone)

        holder.checkTask.setOnCheckedChangeListener { _, isChecked ->
            task.isDone = isChecked
            updateStrikeThrough(holder.checkTask, isChecked)

            onDataChanged()
        }

        holder.btnDelete.setOnClickListener {

            tasks.removeAt(position)

            notifyItemRemoved(position)
            notifyItemRangeChanged(position, tasks.size)

            onDataChanged()
        }
    }

    private fun updateStrikeThrough(checkBox: CheckBox, isDone: Boolean) {
        if (isDone) {
            checkBox.paintFlags =
                checkBox.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG
        } else {
            checkBox.paintFlags =
                checkBox.paintFlags and Paint.STRIKE_THRU_TEXT_FLAG.inv()
        }
    }
}