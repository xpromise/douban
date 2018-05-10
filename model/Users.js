const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10  //加密
const MAX_LOGIN_ATTEMPTS = 5  //密码最多输入次数
const LOCK_TIME = 2 * 60 * 60 * 1000  //锁定时间

const userSchema = new Schema({
  username: {
    unique: true,
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  lockUntil: Number,
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

userSchema.virtual('isLocked').get(() => {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

userSchema.pre('save', next => {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      this.password = hash
      next()
    })
  })

  next()
})


userSchema.methods = {
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) {
          resolve(isMatch)
        } else {
          reject(err)
        }
      })
    })
  },
  incLoginAttempts: (user) => {   //判断用户有无锁定
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, err => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (this.loginAttempts +1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        this.update(updates, err => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
      }
    })
  }
}

const Users = mongoose.model('Users', userSchema)

module.exports = Users
