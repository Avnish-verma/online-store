module.exports = (schema) => {
  schema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash; // Prevent leaking sensitive fields
      return ret;
    }
  });
};