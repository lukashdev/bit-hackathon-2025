import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clean up existing data
  await prisma.proof.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.activityParticipant.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create Interests
  const interestsData = [
    { name: 'Joga', icon: '🧘' }, // matydojogi
    { name: 'Siłownia', icon: '💪' }, // hantle
    { name: 'Muzyka', icon: '🎸' }, // gitara
    { name: 'Literatura', icon: '📚' }, // ksiazki
    { name: 'Podróże', icon: '✈️' }, // walizka
    { name: 'Rywalizacja', icon: '🏆' }, // puchar
    { name: 'Inwestowanie', icon: '💰' }, // zloto
    { name: 'Łamigłówki', icon: '🧩' }, // kostkarubika
    { name: 'Technologia', icon: '💻' }, // komputer
    { name: 'Gotowanie', icon: '🍳' }, // jedzenie
    { name: 'Kawa', icon: '☕' }, // kubek
    { name: 'Ogrodnictwo', icon: '🌱' }, // roslina
    { name: 'Produktywność', icon: '⏱️' }, // zegar
    { name: 'Podcasty', icon: '🎧' }, // sluchawki
    { name: 'Finanse', icon: '📈' }, // gielda
    { name: 'Sztuki walki', icon: '🥊' }, // Rekawice
  ];

  const interests = [];
  for (const interest of interestsData) {
    const createdInterest = await prisma.interest.create({
      data: interest,
    });
    interests.push(createdInterest);
    console.log(`Created interest with id: ${createdInterest.id}`);
  }

  // Create Users
  const usersData = [
    {
      id: 'user-1',
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jan',
      streak: 5,
    },
    {
      id: 'user-2',
      name: 'Anna Nowak',
      email: 'anna.nowak@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      streak: 12,
    },
    {
      id: 'user-3',
      name: 'Piotr Wiśniewski',
      email: 'piotr.wisniewski@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Piotr',
      streak: 2,
    },
    {
      id: 'user-4',
      name: 'Maria Wójcik',
      email: 'maria.wojcik@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      streak: 0,
    },
  ];

  const users = [];
  for (const user of usersData) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        interests: {
          connect: [
            { id: interests[Math.floor(Math.random() * interests.length)].id },
            { id: interests[Math.floor(Math.random() * interests.length)].id },
          ],
        },
      },
    });
    users.push(createdUser);
    console.log(`Created user with id: ${createdUser.id}`);
  }

  // Create Activities
  const activitiesData = [
    {
      name: 'Przygotowanie do maratonu',
      description: 'Wspólne treningi biegowe przygotowujące do maratonu warszawskiego.',
      interestIndex: 0, // Sport
    },
    {
      name: 'Nauka gry na gitarze',
      description: 'Grupa dla początkujących gitarzystów. Dzielimy się postępami co tydzień.',
      interestIndex: 1, // Muzyka
    },
    {
      name: 'Hackathon 2025',
      description: 'Przygotowania do nadchodzącego hackathonu. Kodowanie, design i pizza.',
      interestIndex: 2, // Technologia
    },
    {
      name: 'Klub książki SF',
      description: 'Czytamy klasyki science-fiction i dyskutujemy o nich.',
      interestIndex: 6, // Nauka
    },
  ];

  const activities = [];
  for (const activity of activitiesData) {
    const createdActivity = await prisma.activity.create({
      data: {
        name: activity.name,
        description: activity.description,
        interests: {
          connect: [{ id: interests[activity.interestIndex].id }],
        },
      },
    });
    activities.push(createdActivity);
    console.log(`Created activity with id: ${createdActivity.id}`);
  }

  // Add Participants to Activities
  // User 1 creates Activity 1
  await prisma.activityParticipant.create({
    data: {
      userId: users[0].id,
      activityId: activities[0].id,
      role: 'OWNER',
    },
  });
  // User 2 joins Activity 1
  await prisma.activityParticipant.create({
    data: {
      userId: users[1].id,
      activityId: activities[0].id,
      role: 'MEMBER',
    },
  });

  // User 2 creates Activity 2
  await prisma.activityParticipant.create({
    data: {
      userId: users[1].id,
      activityId: activities[1].id,
      role: 'OWNER',
    },
  });

  // User 3 creates Activity 3
  await prisma.activityParticipant.create({
    data: {
      userId: users[2].id,
      activityId: activities[2].id,
      role: 'OWNER',
    },
  });
  // User 1 joins Activity 3
  await prisma.activityParticipant.create({
    data: {
      userId: users[0].id,
      activityId: activities[2].id,
      role: 'ADMIN',
    },
  });
  // User 4 joins Activity 3
  await prisma.activityParticipant.create({
    data: {
      userId: users[3].id,
      activityId: activities[2].id,
      role: 'MEMBER',
    },
  });

  // Create Goals
  const goalsData = [
    {
      activityId: activities[0].id,
      title: 'Przebiec 5km poniżej 30 min',
      description: 'Pierwszy kamień milowy w treningu.',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      categoryId: interests[0].id,
    },
    {
      activityId: activities[0].id,
      title: 'Przebiec 10km',
      description: 'Zwiększamy dystans.',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28'),
      categoryId: interests[0].id,
    },
    {
      activityId: activities[1].id,
      title: 'Nauczyć się akordów barowych',
      description: 'Opanowanie F-dur i H-moll.',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-02-15'),
      categoryId: interests[1].id,
    },
    {
      activityId: activities[2].id,
      title: 'Stworzyć MVP aplikacji',
      description: 'Działający prototyp z podstawowymi funkcjami.',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-14'),
      categoryId: interests[2].id,
    },
  ];

  const goals = [];
  for (const goal of goalsData) {
    const createdGoal = await prisma.goal.create({
      data: goal,
    });
    goals.push(createdGoal);
    console.log(`Created goal with id: ${createdGoal.id}`);
  }

  // Create Progress
  // User 1 on Goal 1 (Completed)
  await prisma.progress.create({
    data: {
      userId: users[0].id,
      goalId: goals[0].id,
      isCompleted: true,
      completedAt: new Date('2025-01-20'),
    },
  });

  // User 2 on Goal 1 (In Progress)
  await prisma.progress.create({
    data: {
      userId: users[1].id,
      goalId: goals[0].id,
      isCompleted: false,
    },
  });

  // User 1 on Goal 2 (In Progress)
  await prisma.progress.create({
    data: {
      userId: users[0].id,
      goalId: goals[1].id,
      isCompleted: false,
    },
  });

  // User 3 on Goal 4 (Completed)
  await prisma.progress.create({
    data: {
      userId: users[2].id,
      goalId: goals[3].id,
      isCompleted: true,
      completedAt: new Date('2025-03-10'),
    },
  });

  // Create Proofs
  // Proof for User 1 on Goal 1
  await prisma.proof.create({
    data: {
      userId: users[0].id,
      goalId: goals[0].id,
      proofImage: Buffer.from('fake-image-data'),
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
