import { addDays } from 'date-fns';

const mockProjects = [
  {
    name: 'Japanese',
    // color: '#3ae3b7',
    color: '#0fefcd',
    habits: [
      {
        name: '日本語 immersion (1.5h)',
        color: '#00aaff',
        description:
          'P.S. each filled square correlates with 1.5 hours of immersion, so in the heatmap above the daily goal is 4 x 1.5 = 6 hours of immersion in native content',
        data: [
          { value: 3, date: 3 },
          { value: 4, date: 4 },
          { value: 3, date: 5 },
          { value: 2, date: 6 },
          { value: 5, date: 7 },
          { value: 4, date: 8 },
          { value: 5, date: 9 },
          { value: 3, date: 10 },
          { value: 3, date: 11 },
          { value: 4, date: 12 },
          { value: 3, date: 13 },
          { value: 2, date: 14 },
        ],
        targets: [
          {
            date_start: 3,
            period: 1,
            value: 4,
          },
        ],
      },
      {
        name: '日本語 words reviewed',
        color: '#07c0db',
        is_numeric: true,
        data: [
          { value: 86, date: 3 },
          { value: 112, date: 4 },
          { value: 94, date: 5 },
          { value: 61, date: 6 },
          { value: 175, date: 7 },
          { value: 129, date: 8 },
          { value: 95, date: 9 },
          { value: 38, date: 10 },
        ],
        targets: [
          {
            date_start: 0,
            period: 1,
            value: 10,
          },
        ],
      },
      {
        name: '日本語 new words',
        color: '#10a9b5',
        is_numeric: true,
        data: [
          { value: 20, date: 3 },
          { value: 33, date: 4 },
          { value: 7, date: 5 },
          { value: 3, date: 6 },
          { value: 41, date: 7 },
          { value: 30, date: 8 },
          { value: 15, date: 9 },
          { value: 2, date: 10 },
        ],
        targets: [
          {
            date_start: 0,
            period: 1,
            value: 10,
          },
        ],
      },
    ],
  },
  {
    name: 'Fitness',
    color: '#e82020', // FIX: red
    habits: [
      {
        name: 'Running (km)',
        color: '#10FA31',
        is_numeric: true,
        data: [
          { value: 2, date: 0 },
          { value: 3, date: 7 },
          { value: 4, date: 14 },
        ],
        targets: [
          {
            date_start: 0,
            period: 7,
            value: 3,
          },
        ],
      },
      {
        name: 'Stretching',
        color: '#FFE38C',
        data: [
          { value: 1, date: 0 },
          { value: 1, date: 3 },
          { value: 1, date: 9 },
          { value: 1, date: 12 },
          { value: 1, date: 13 },
          { value: 1, date: 14 },
          { value: 1, date: 15 },
        ],
        targets: [
          {
            date_start: 0,
            period: 3,
            value: 1,
          },
          {
            date_start: 12,
            period: 1,
            value: 1,
          },
        ],
      },
      {
        name: 'Healthy meals',
        color: '#FFFF28',
        created_at: 3,
        data: [
          { value: 1, date: 3 },
          { value: 1, date: 4 },
          { value: 1, date: 5 },
          { value: 1, date: 6 },
          { value: 1, date: 8 },
          { value: 1, date: 9 },
          { value: 2, date: 10 },
          { value: 2, date: 11 },
          { value: 1, date: 12 },
          { value: 2, date: 13 },
          { value: 1, date: 14 },
          { value: 2, date: 15 },
        ],
        targets: [
          {
            date_start: 3,
            period: 1,
            value: 1,
          },
          {
            date_start: 10,
            period: 1,
            value: 2,
          },
        ],
      },
      {
        name: 'Pull up variations',
        color: '#FF0000',
        created_at: 5,
        is_numeric: true,
        data: [
          { value: 21, date: 5 },
          { value: 15, date: 6 },
          { value: 20, date: 7 },
          { value: 25, date: 8 },
          { value: 29, date: 9 },
          { value: 33, date: 10 },
          { value: 10, date: 11 },
          { value: 40, date: 12 },
          { value: 37, date: 13 },
          { value: 42, date: 14 },
          { value: 44, date: 15 },
        ],
        targets: [
          {
            date_start: 5,
            period: 1,
            value: 20,
          },
        ],
      },
      {
        name: 'New calisthenics move',
        color: '#00FF52',
        created_at: 8,
        data: [{ value: 2, date: 8 }],
        targets: [
          {
            date_start: 8,
            period: 7,
            value: 1,
          },
        ],
      },
    ],
  },
  {
    name: 'Development',
    color: '#0080FF',
    habits: [
      {
        name: 'Meditating',
        color: '#21FF00',
        data: [
          { value: 1, date: 0 },
          { value: 1, date: 1 },
          { value: 1, date: 6 },
          { value: 1, date: 11 },
        ],
        targets: [
          {
            date_start: 0,
            period: 1,
            value: 1,
          },
          {
            date_start: 6,
            period: 5,
            value: 1,
          },
        ],
      },
      {
        name: 'Programming (1.5h)',
        color: '#0080FF',
        data: [
          { value: 1, date: 0 },
          { value: 1, date: 1 },
          { value: 1, date: 3 },
          { value: 1, date: 5 },
          { value: 2, date: 6 },
          { value: 1, date: 7 },
          { value: 2, date: 8 },
          { value: 2, date: 9 },
          { value: 2, date: 10 },
          { value: 2, date: 11 },
          { value: 1, date: 12 },
          { value: 2, date: 13 },
          { value: 2, date: 14 },
          { value: 3, date: 15 },
        ],
        targets: [
          {
            date_start: 0,
            period: 1,
            value: 1,
          },
          {
            date_start: 6,
            period: 1,
            value: 2,
          },
          {
            date_start: 14,
            period: 1,
            value: 3,
          },
        ],
      },
      {
        name: 'Time of waking up',
        color: '#0E0359',
        is_numeric: true,
        created_at: 2,
        data: [
          { value: 12, date: 2 },
          { value: 13, date: 3 },
          { value: 12, date: 4 },
          { value: 11, date: 5 },
          { value: 11, date: 6 },
          { value: 10, date: 7 },
          { value: 10, date: 8 },
          { value: 9, date: 9 },
          { value: 9, date: 10 },
          { value: 8, date: 11 },
          { value: 10, date: 12 },
          { value: 9, date: 13 },
          { value: 9, date: 14 },
          { value: 9, date: 15 },
        ],
        targets: [
          {
            date_start: 2,
            period: 1,
            value: 9,
          },
        ],
      },
      {
        name: 'Walks',
        color: '#34FF63',
        created_at: 4,
        data: [
          { value: 1, date: 4 },
          { value: 1, date: 5 },
          { value: 1, date: 7 },
          { value: 1, date: 9 },
          { value: 1, date: 10 },
          { value: 1, date: 11 },
          { value: 1, date: 12 },
          { value: 1, date: 13 },
          { value: 1, date: 14 },
          { value: 1, date: 15 },
        ],
        targets: [
          {
            date_start: 4,
            period: 1,
            value: 1,
          },
        ],
      },
      {
        name: 'Plan the next day',
        color: '#1FFF82',
        created_at: 9,
        data: [
          { value: 1, date: 9 },
          { value: 1, date: 10 },
          { value: 1, date: 15 },
        ],
        targets: [
          {
            date_start: 9,
            period: 1,
            value: 1,
          },
        ],
      },
    ],
  },
  {
    name: 'Social',
    color: '#6900C9',
    habits: [
      {
        name: 'Take Emma out',
        color: '#FF009E',
        data: [
          { value: 2, date: 0 },
          { value: 1, date: 6 },
          { value: 2, date: 13 },
        ],
        targets: [
          {
            date_start: -1,
            period: 7,
            value: 2,
          },
        ],
      },
      {
        name: 'DnD',
        color: '#FFD100',
        created_at: 5,
        data: [{ value: 1, date: 5 }],
        targets: [
          {
            date_start: 5,
            period: 14,
            value: 1,
          },
        ],
      },
      {
        name: 'Call grandma',
        color: '#FF0000',
        created_at: 7,
        data: [
          { value: 1, date: 7 },
          { value: 1, date: 14 },
        ],
        targets: [
          {
            date_start: 7,
            period: 7,
            value: 1,
          },
        ],
      },
      {
        name: "Review team's progress",
        color: '#ABFF00',
        created_at: 8,
        data: [
          { value: 1, date: 8 },
          { value: 1, date: 15 },
        ],
        targets: [
          {
            date_start: 8,
            period: 7,
            value: 1,
          },
        ],
      },
    ],
  },
  {
    name: 'Cleaning',
    color: '#23AFCF',
    habits: [
      {
        name: 'Taking out garbage, dust',
        color: '#23AFCF',
        data: [
          { value: 2, date: 2 },
          { value: 1, date: 9 },
        ],
        targets: [
          {
            date_start: -5,
            period: 7,
            value: 1,
          },
        ],
      },
      {
        name: 'Laundry bedsheets',
        color: '#21D5B7',
        data: [{ value: 1, date: 0 }],
        targets: [
          {
            date_start: -8,
            period: 21,
            value: 1,
          },
        ],
      },
      {
        name: 'Wash all dishes',
        color: '#FFA402',
        created_at: 2,
        data: [
          { value: 1, date: 2 },
          { value: 1, date: 3 },
          { value: 1, date: 6 },
          { value: 1, date: 12 },
          { value: 1, date: 13 },
          { value: 1, date: 14 },
          { value: 1, date: 15 },
        ],
        targets: [
          {
            date_start: 2,
            period: 1,
            value: 1,
          },
        ],
      },
      {
        name: 'Laundry black',
        color: '#000000',
        created_at: 7,
        data: [{ value: 1, date: 7 }],
        targets: [
          {
            date_start: 7,
            period: 14,
            value: 1,
          },
        ],
      },
      {
        name: 'Mopping the floor',
        color: '#05A1BF',
        created_at: 7,
        data: [{ value: 1, date: 7 }],
        targets: [
          {
            date_start: 7,
            period: 14,
            value: 1,
          },
        ],
      },
      {
        name: 'Laundry white',
        color: '#4CFFAB',
        created_at: 7,
        data: [{ value: 1, date: 7 }],
        targets: [
          {
            date_start: 7,
            period: 14,
            value: 1,
          },
        ],
      },
    ],
  },
  {
    name: 'Vitamins',
    color: '#ACFF06',
    habits: [
      {
        name: 'Vitamin D3',
        color: '#00FF8F',
        data: [
          { value: 1, date: 0 },
          { value: 1, date: 1 },
          { value: 1, date: 4 },
          { value: 1, date: 5 },
          { value: 1, date: 6 },
          { value: 1, date: 8 },
          { value: 1, date: 9 },
          { value: 1, date: 10 },
          { value: 1, date: 11 },
          { value: 1, date: 14 },
        ],
        targets: [
          {
            date_start: 0,
            period: 1,
            value: 1,
          },
        ],
      },
      {
        name: 'Omega3',
        color: '#FFC200',
        created_at: 3,
        data: [
          { value: 2, date: 3 },
          { value: 1, date: 4 },
          { value: 1, date: 6 },
          { value: 1, date: 8 },
          { value: 2, date: 10 },
          { value: 1, date: 12 },
        ],
        targets: [
          {
            date_start: 3,
            period: 1,
            value: 2,
          },
          {
            date_start: 4,
            period: 1,
            value: 1,
          },
          {
            date_start: 5,
            period: 1,
            value: 2,
          },
        ],
      },
      {
        name: 'Vitamin C',
        color: '#F7FF00',
        created_at: 3,
        data: [
          { value: 1, date: 3 },
          { value: 1, date: 5 },
          { value: 1, date: 9 },
        ],
        targets: [
          {
            date_start: 3,
            period: 1,
            value: 1,
          },
        ],
      },
      {
        name: 'Vitamin K',
        color: '#6487AB',
        created_at: 6,
        data: [
          { value: 1, date: 6 },
          { value: 1, date: 8 },
          { value: 1, date: 12 },
        ],
        targets: [
          {
            date_start: 6,
            period: 1,
            value: 1,
          },
        ],
      },
      {
        name: 'Fasting',
        color: '#FF8D00',
        created_at: 7,
        data: [{ value: 1, date: 7 }],
        targets: [],
      },
    ],
  },
];

const currentDate = addDays(new Date(), -15);

for (let i = 0; i < mockProjects.length; i++) {
  const project = mockProjects[i];
  Object.assign(project, {
    id: `project-${i}`,
    order_index: i,
    created_at: currentDate,
    updated_at: currentDate,
    description: '',
    user_id: 'mock',
  });
  for (let j = 0; j < project.habits.length; j++) {
    const habit = project.habits[j];
    const date = addDays(currentDate, habit?.created_at ?? 0);
    Object.assign(habit, {
      id: `${i}-${j}`,
      created_at: date,
      updated_at: date,
      [project.description ? 'description' : '']: '',
      user_id: 'mock',
    });
    for (let k = 0; k < habit.targets.length; k++) {
      habit.targets[k].date_start = addDays(currentDate, habit.targets[k].date_start);
    }
    for (let k = 0; k < habit.data.length; k++) {
      habit.data[k].date = addDays(currentDate, habit.data[k].date);
    }
  }
}

export default mockProjects;
