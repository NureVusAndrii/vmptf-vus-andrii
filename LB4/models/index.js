import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const Student = sequelize.define("Student", {
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  group_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: "Students",
  timestamps: false
});

export const Teacher = sequelize.define("Teacher", {
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: "Teachers",
  timestamps: false
});

export const Course = sequelize.define("Course", {
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "Courses",
  timestamps: false
});

export const Class = sequelize.define("Class", {
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  class_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  room: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: "Classes",
  timestamps: false
});

export const Grade = sequelize.define("Grade", {
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  graded_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "Grades",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["student_id", "course_id"]
    }
  ]
});

Teacher.hasMany(Course, { foreignKey: "teacher_id" });
Course.belongsTo(Teacher, { foreignKey: "teacher_id" });

Course.hasMany(Class, { foreignKey: "course_id" });
Class.belongsTo(Course, { foreignKey: "course_id" });

Student.hasMany(Grade, { foreignKey: "student_id" });
Grade.belongsTo(Student, { foreignKey: "student_id" });

Course.hasMany(Grade, { foreignKey: "course_id" });
Grade.belongsTo(Course, { foreignKey: "course_id" });

export default {
  sequelize,
  Student,
  Teacher,
  Course,
  Class,
  Grade
};