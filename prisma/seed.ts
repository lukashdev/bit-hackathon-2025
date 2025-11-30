import { PrismaClient } from '@prisma/client';
import { auth } from '../src/lib/auth';

const prisma = new PrismaClient();

// Helper to get date relative to now (days)
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
// Set yesterday to end of day to be safe or just use it as max cap
yesterday.setHours(23, 59, 59, 999);

const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

async function fetchImageBuffer(url: string): Promise<Buffer> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (e) {
        console.warn(`Failed to fetch image from ${url}, using fallback.`, e);
        return Buffer.from('fake-image-data-' + Math.random());
    }
}

async function main() {
  console.log('Start seeding ...');

  // Clean up existing data
  // Order matters due to foreign keys
  await prisma.like.deleteMany();
  await prisma.proof.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.activityParticipant.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create Interests
  const interestsData = [
    { name: 'Joga', icon: '🧘' },
    { name: 'Siłownia', icon: '💪' },
    { name: 'Muzyka', icon: '🎸' },
    { name: 'Literatura', icon: '📚' },
    { name: 'Podróże', icon: '✈️' },
    { name: 'Rywalizacja', icon: '🏆' },
    { name: 'Inwestowanie', icon: '💰' },
    { name: 'Łamigłówki', icon: '🧩' },
    { name: 'Technologia', icon: '💻' },
    { name: 'Gotowanie', icon: '🍳' },
    { name: 'Kawa', icon: '☕' },
    { name: 'Ogrodnictwo', icon: '🌱' },
    { name: 'Produktywność', icon: '⏱️' },
    { name: 'Podcasty', icon: '🎧' },
    { name: 'Finanse', icon: '📈' },
    { name: 'Sztuki walki', icon: '🥊' },
    { name: 'Bieganie', icon: '🏃' },
    { name: 'Pływanie', icon: '🏊' },
    { name: 'Rower', icon: '🚴' },
    { name: 'Fotografia', icon: '📷' },
  ];

  const interests = [];
  for (const interest of interestsData) {
    const createdInterest = await prisma.interest.create({
      data: interest,
    });
    interests.push(createdInterest);
    console.log(`Created interest: ${createdInterest.name}`);
  }

  // Create Users using better-auth
  const usersData = [
    { name: 'Jan Kowalski', email: 'jan.kowalski@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jan' },
    { name: 'Anna Nowak', email: 'anna.nowak@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' },
    { name: 'Piotr Wiśniewski', email: 'piotr.wisniewski@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Piotr' },
    { name: 'Maria Wójcik', email: 'maria.wojcik@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
    { name: 'Tomasz Zieliński', email: 'tomasz.zielinski@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tomasz' },
    { name: 'Katarzyna Mazur', email: 'katarzyna.mazur@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Katarzyna' },
    { name: 'Michał Lewandowski', email: 'michal.lewandowski@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michal' },
    { name: 'Agnieszka Kamińska', email: 'agnieszka.kaminska@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agnieszka' },
    { name: 'Krzysztof Dąbrowski', email: 'krzysztof.dabrowski@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Krzysztof' },
    { name: 'Magdalena Szymańska', email: 'magdalena.szymanska@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Magdalena' },
  ];

  const users = [];
  for (const userData of usersData) {
    try {
        const res = await auth.api.signUpEmail({
            body: {
                email: userData.email,
                password: 'password123',
                name: userData.name,
                image: userData.image,
            }
        });
        
        // Shuffle interests to get unique random ones
        const shuffledInterests = [...interests].sort(() => 0.5 - Math.random());
        const selectedInterests = shuffledInterests.slice(0, 3);

        const updatedUser = await prisma.user.update({
            where: { id: res.user.id },
            data: {
                image: userData.image,
                streak: Math.floor(Math.random() * 30),
                interests: {
                    connect: selectedInterests.map(i => ({ id: i.id }))
                }
            }
        });

        users.push(updatedUser);
        console.log(`Created user: ${updatedUser.email}`);
    } catch (e) {
        console.error(`Failed to create user ${userData.email}:`, e);
    }
  }

  // Create Activities
  const activitiesData = [
    {
      name: 'Przygotowanie do maratonu',
      description: 'Wspólne treningi biegowe przygotowujące do maratonu warszawskiego. Spotykamy się w każdy wtorek i czwartek.',
      interestName: 'Bieganie',
    },
    {
      name: 'Nauka gry na gitarze',
      description: 'Grupa dla początkujących gitarzystów. Dzielimy się postępami co tydzień i wymieniamy tabulaturami.',
      interestName: 'Muzyka',
    },
    {
      name: 'Hackathon 2025',
      description: 'Przygotowania do nadchodzącego hackathonu. Kodowanie, design i pizza. Cel: wygrać główną nagrodę!',
      interestName: 'Technologia',
    },
    {
      name: 'Klub książki SF',
      description: 'Czytamy klasyki science-fiction i dyskutujemy o nich przy kawie.',
      interestName: 'Literatura',
    },
    {
      name: 'Joga o poranku',
      description: 'Codzienna praktyka jogi dla początkujących i zaawansowanych. Zaczynamy dzień z dobrą energią.',
      interestName: 'Joga',
    },
    {
      name: 'Fotografia miejska',
      description: 'Wspólne wypady na miasto w poszukiwaniu ciekawych kadrów. Analiza zdjęć i nauka obróbki.',
      interestName: 'Fotografia',
    },
  ];

  const activities = [];
  for (const activityData of activitiesData) {
    const interest = interests.find(i => i.name === activityData.interestName) || interests[0];
    const createdActivity = await prisma.activity.create({
      data: {
        name: activityData.name,
        description: activityData.description,
        interests: {
          connect: [{ id: interest.id }],
        },
      },
    });
    activities.push(createdActivity);
    console.log(`Created activity: ${createdActivity.name}`);
  }

  // Assign Participants (Randomly)
  for (const activity of activities) {
      // Pick a random owner
      const owner = users[Math.floor(Math.random() * users.length)];
      await prisma.activityParticipant.create({
          data: { userId: owner.id, activityId: activity.id, role: 'OWNER' }
      });

      // Pick random members (2-6 members)
      const numMembers = Math.floor(Math.random() * 5) + 2;
      const potentialMembers = users.filter(u => u.id !== owner.id);
      
      // Shuffle potential members
      for (let i = potentialMembers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [potentialMembers[i], potentialMembers[j]] = [potentialMembers[j], potentialMembers[i]];
      }

      for (let i = 0; i < numMembers; i++) {
          if (i < potentialMembers.length) {
              const role = Math.random() > 0.8 ? 'ADMIN' : 'MEMBER';
              await prisma.activityParticipant.create({
                  data: { userId: potentialMembers[i].id, activityId: activity.id, role }
              });
          }
      }
  }

  // Create Goals for each activity
  const goals = [];
  for (const activity of activities) {
      const activityInterest = await prisma.activity.findUnique({
          where: { id: activity.id },
          include: { interests: true }
      }).then(a => a?.interests[0]);

      const numGoals = Math.floor(Math.random() * 4) + 4; // 4-8 goals
      
      for (let i = 0; i < numGoals; i++) {
          // Distribute goals: some past, some current, some future
          let startDate, endDate;
          const rand = Math.random();
          
          if (rand < 0.4) { // Past
              startDate = addDays(-30 - Math.floor(Math.random() * 30));
              endDate = addDays(-Math.floor(Math.random() * 20));
          } else if (rand < 0.8) { // Current
              startDate = addDays(-Math.floor(Math.random() * 10));
              endDate = addDays(Math.floor(Math.random() * 20) + 1);
          } else { // Future
              startDate = addDays(Math.floor(Math.random() * 10) + 1);
              endDate = addDays(Math.floor(Math.random() * 30) + 10);
          }

          const createdGoal = await prisma.goal.create({
              data: {
                  activityId: activity.id,
                  title: `Cel ${i + 1}: ${activity.name.split(' ')[0]} - Etap ${i + 1}`,
                  description: `Opis celu numer ${i + 1} dla aktywności ${activity.name}.`,
                  startDate,
                  endDate,
                  categoryId: activityInterest?.id,
              }
          });
          goals.push(createdGoal);
      }
  }

  // Create Progress & Proofs
  // Iterate over all goals
  for (const goal of goals) {
      // Get participants for this goal's activity
      const participants = await prisma.activityParticipant.findMany({
          where: { activityId: goal.activityId },
          include: { user: true }
      });

      const isPast = goal.endDate < now;
      const isFuture = goal.startDate > now;

      if (isFuture) continue; // No progress for future goals

      for (const participant of participants) {
          // Randomly decide if user completed the goal
          // Higher chance if past, lower if current
          const chance = isPast ? 0.7 : 0.4;
          
          if (Math.random() < chance) {
              let completedAt = new Date(goal.startDate.getTime() + Math.random() * (goal.endDate.getTime() - goal.startDate.getTime()));
              
              // Ensure completedAt is not in the future relative to yesterday
              if (completedAt > yesterday) {
                  // If generated date is after yesterday, cap it at yesterday or random time before yesterday
                  // But we must ensure it's still after startDate. 
                  // If startDate is after yesterday, then we can't have a proof yet (logic handled by isFuture check above mostly, but let's be safe)
                  if (goal.startDate > yesterday) {
                      continue; // Cannot complete if start date is in future relative to yesterday
                  }
                  // Cap at yesterday
                  const maxTime = yesterday.getTime();
                  const minTime = goal.startDate.getTime();
                  completedAt = new Date(minTime + Math.random() * (maxTime - minTime));
              }

              // Create Progress
              await prisma.progress.create({
                  data: {
                      userId: participant.userId,
                      goalId: goal.id,
                      isCompleted: true,
                      completedAt
                  }
              });

              // Create Proof (with image)
              const imageBuffer = await fetchImageBuffer(`https://picsum.photos/seed/${goal.id}-${participant.userId}/400/300`);
              
              const proof = await prisma.proof.create({
                  data: {
                      userId: participant.userId,
                      goalId: goal.id,
                      proofImage: imageBuffer,
                      createdAt: completedAt
                  }
              });

              // Add Likes
              const otherParticipants = participants.filter(p => p.userId !== participant.userId);
              for (const other of otherParticipants) {
                  if (Math.random() > 0.5) {
                      await prisma.like.create({
                          data: {
                              userId: other.userId,
                              proofId: proof.id
                          }
                      });
                  }
              }
          } else if (!isPast && Math.random() > 0.5) {
              // In progress but not completed
               await prisma.progress.create({
                  data: {
                      userId: participant.userId,
                      goalId: goal.id,
                      isCompleted: false
                  }
              });
          }
      }
  }

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
