export const notNull = (attributeName) => {
  return {
    foreignKey: {
      allowNull: false,
      name: attributeName
    }
  }
}
