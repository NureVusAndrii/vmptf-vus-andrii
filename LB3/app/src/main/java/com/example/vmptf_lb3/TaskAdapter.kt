package com.example.vmptf_lb3

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.example.vmptf_lb3.models.Task

class TaskAdapter(
    private var tasks: List<Task>,
    private val onToggle: (Task) -> Unit,
    private val onDelete: (Task) -> Unit
) : RecyclerView.Adapter<TaskAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val tvUserId: TextView = v.findViewById(R.id.tvUserId)
        val title: TextView = v.findViewById(R.id.tvTaskTitle)
        val tvDueDate: TextView = v.findViewById(R.id.tvDueDate)
        val cb: CheckBox = v.findViewById(R.id.cbCompleted)
        val btn: Button = v.findViewById(R.id.btnDelete)
    }

    private fun formatId(id: Any): String {
        return id.toString().replace(".0", "")
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_task, parent, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val task = tasks[position]
        holder.title.text = task.title
        holder.tvDueDate.text = task.dueDate ?: "No deadline"

        try {
            val rawUid = task.userId.toString()
            val formattedUid = java.math.BigDecimal(rawUid).toPlainString().replace(".0", "")
            holder.tvUserId.text = "Assigned to UID: $formattedUid"
        } catch (e: Exception) {
            holder.tvUserId.text = "Assigned to UID: ${task.userId}"
        }

        holder.cb.setOnCheckedChangeListener(null)
        holder.cb.isChecked = task.completed
        holder.cb.setOnClickListener { onToggle(task) }
        holder.btn.setOnClickListener { onDelete(task) }
    }

    override fun getItemCount() = tasks.size

    fun update(newTasks: List<Task>) {
        tasks = newTasks
        notifyDataSetChanged()
    }
}