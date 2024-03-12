const users = [
  {
    id: '1',
    name: 'Matt',
    foods: [
      'cheese', 'pie', 'sausage',
    ],
  },
  {
    id: '2',
    name: 'George',
    foods: [
      'carrot', 'cake', 'tomato',
    ],
  },
  {
    id: '3',
    name: 'Mildred',
    foods: [
      'olives', 'feta', 'tofu',
    ],
  },
];

export function getAllUsers() {
  return users;
}

export function getUser(id) {
  return users.filter(user => user.id === id)[0];
}
