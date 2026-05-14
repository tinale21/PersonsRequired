function trimForLight(items, keepFraction = 0.6, minimum = 2) {
  return items.slice(0, Math.max(minimum, Math.ceil(items.length * keepFraction)))
}

export function generateCategories(answers) {
  const { housing, sharing, priority } = answers
  const owned = answers.owned || []
  const isLight = priority === 'light'
  const isPrepared = priority === 'prepared'
  const categories = []

  // Clothes — split by everyday vs winter ownership
  const clothes = []
  if (!owned.includes('everyday')) {
    clothes.push('Everyday outfits', 'Loungewear', 'Pajamas', 'Underwear', 'Socks', 'Athletic wear', 'Sneakers')
    if (isPrepared) clothes.push('One nice outfit', 'Dress shoes', 'Workout shoes')
  }
  if (!owned.includes('winter')) {
    clothes.push('Heavy winter coat', 'Boots', 'Scarf', 'Gloves', 'Beanie', 'Thermal base layer')
    if (isPrepared) clothes.push('Snow boots', 'Wool socks', 'Insulated mittens')
  }
  if (clothes.length) {
    categories.push({ id: 'clothes', name: 'Clothes', items: isLight ? trimForLight(clothes) : clothes })
  }

  // Bedding
  if (!owned.includes('bedding')) {
    const bedding = housing === 'on'
      ? ['Twin XL Sheets', 'Mattress Topper', 'Twin XL Comforter', 'Pillows', 'Pillowcases']
      : ['Sheets', 'Comforter', 'Pillows', 'Pillowcases', 'Blanket']
    if (isPrepared) bedding.push('Extra blanket', 'Mattress protector')
    categories.push({ id: 'bedding', name: 'Bedding', items: isLight ? trimForLight(bedding) : bedding })
  }

  // Dorm or Apartment setup
  if (housing === 'on') {
    const dorm = ['Storage Bins', 'Trash can', 'Mirror', 'Desk lamp', 'Hangers', 'Power strip']
    if (sharing === 'no') dorm.push('Mini fridge', 'Floor lamp')
    if (isPrepared) dorm.push('Bed risers', 'Over-the-door hooks', 'Drawer organizers')
    if (!owned.includes('decor')) {
      dorm.push('Posters', 'String lights', 'Throw pillow')
      if (isPrepared) dorm.push('Small rug', 'Photo frames')
    }
    categories.push({ id: 'dorm', name: 'Dorm Room Setup', items: isLight ? trimForLight(dorm) : dorm })
  } else if (housing === 'off') {
    const apt = ['Trash can', 'Mirror', 'Desk lamp', 'Hangers', 'Power strip', 'Plates & bowls', 'Mugs & glasses', 'Utensils', 'Pots & pans']
    if (sharing === 'no') apt.push('Floor lamp', 'Side table')
    if (isPrepared) apt.push('Vacuum', 'Iron', 'Drying rack', 'Toolkit')
    if (!owned.includes('decor')) {
      apt.push('Wall art', 'Throw pillows', 'Area rug')
      if (isPrepared) apt.push('Curtains', 'Plants')
    }
    categories.push({ id: 'apartment', name: 'Apartment Setup', items: isLight ? trimForLight(apt) : apt })
  }

  // Toiletries
  if (!owned.includes('toiletries')) {
    const toilet = ['Shampoo', 'Conditioner', 'Body wash', 'Toothbrush', 'Toothpaste', 'Shower caddy']
    if (housing === 'on') toilet.push('Flip flops for shared bathroom', 'Robe')
    if (isPrepared) toilet.push('First aid kit', 'Medications', 'Skincare', 'Hair tools')
    categories.push({ id: 'toiletries', name: 'Toiletries', items: isLight ? trimForLight(toilet) : toilet })
  }

  // Laundry
  if (!owned.includes('laundry')) {
    const laundry = ['Laundry detergent', 'Laundry bag', 'Dryer sheets']
    if (isPrepared) laundry.push('Stain remover', 'Mesh delicates bag', 'Quarters or laundry card')
    categories.push({ id: 'laundry', name: 'Laundry Supplies', items: laundry })
  }

  // Cleaning supplies — always relevant
  const cleaning = ['Disinfecting wipes', 'Paper towels', 'Tissues', 'Trash bags']
  if (isPrepared) cleaning.push('All-purpose cleaner', 'Sponges', 'Glass cleaner')
  categories.push({ id: 'cleaning', name: 'Cleaning Supplies', items: isLight ? trimForLight(cleaning) : cleaning })

  return categories
}

let nextId = 1
function makeTask(label, categoryId, categoryName) {
  return {
    id: `${categoryId}-${Date.now()}-${nextId++}`,
    label,
    categoryId,
    categoryName,
    checked: false,
    custom: false,
  }
}

export function generateTasks(answers) {
  const cats = generateCategories(answers)
  const tasks = []
  cats.forEach((c) => {
    c.items.forEach((label) => tasks.push(makeTask(label, c.id, c.name)))
  })
  return tasks
}

export function makeCustomTask(label, categoryName = 'Other', categoryId = 'custom') {
  return {
    id: `custom-${Date.now()}-${nextId++}`,
    label,
    categoryId,
    categoryName,
    checked: false,
    custom: true,
  }
}
