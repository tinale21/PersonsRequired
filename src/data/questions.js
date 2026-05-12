export const questions = [
  {
    id: 'housing',
    text: 'Are you living on or off campus?',
    type: 'single',
    options: [
      { value: 'on', label: 'On Campus' },
      { value: 'off', label: 'Off Campus' },
    ],
  },
  {
    id: 'sharing',
    text: 'Are you sharing a room?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'priority',
    text: 'What matters more: packing light or fully prepared?',
    type: 'single',
    options: [
      { value: 'light', label: 'Packing Light' },
      { value: 'prepared', label: 'Fully Prepared' },
    ],
  },
  {
    id: 'owned',
    text: 'What items do you already own?',
    type: 'multi',
    options: [
      { value: 'bedding', label: 'Bedding' },
      { value: 'laundry', label: 'Laundry Supplies' },
      { value: 'toiletries', label: 'Toiletries' },
      { value: 'everyday', label: 'Everyday Clothes' },
      { value: 'winter', label: 'Winter Clothes' },
      { value: 'decor', label: 'Decor' },
    ],
  },
]
