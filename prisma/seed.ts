import { PrismaClient, type Video } from '../app/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

const adapter = new PrismaLibSql({ url: 'file:./prisma/utube.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.history.deleteMany();
  await prisma.likedVideo.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.video.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password,
      displayName: 'Alice Chen',
      photoURL: 'https://ui-avatars.com/api/?name=Alice+Chen&background=FF0000&color=fff',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password,
      displayName: 'Bob Wang',
      photoURL: 'https://ui-avatars.com/api/?name=Bob+Wang&background=0066FF&color=fff',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      password,
      displayName: 'Charlie Li',
      photoURL: 'https://ui-avatars.com/api/?name=Charlie+Li&background=00CC66&color=fff',
    },
  });

  // Sample video data with public domain / creative commons thumbnails
  const sampleVideos = [
    {
      title: 'Learn Next.js in 30 Minutes',
      description: 'A quick introduction to Next.js App Router, Server Components, and more.',
      thumbnail: 'https://picsum.photos/seed/nextjs/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: alice.id,
      views: 12500,
    },
    {
      title: 'Building a YouTube Clone with React',
      description: 'Step by step tutorial on building a YouTube clone.',
      thumbnail: 'https://picsum.photos/seed/react/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: alice.id,
      views: 8300,
    },
    {
      title: 'TypeScript for Beginners',
      description: 'Learn TypeScript basics and advanced patterns.',
      thumbnail: 'https://picsum.photos/seed/typescript/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: bob.id,
      views: 45000,
    },
    {
      title: 'Prisma ORM Tutorial - SQLite to PostgreSQL',
      description: 'Master Prisma ORM from development to production.',
      thumbnail: 'https://picsum.photos/seed/prisma/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: bob.id,
      views: 6700,
    },
    {
      title: 'CSS Grid Layout Complete Guide',
      description: 'Everything you need to know about CSS Grid.',
      thumbnail: 'https://picsum.photos/seed/cssgrid/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: charlie.id,
      views: 23100,
    },
    {
      title: 'Node.js REST API from Scratch',
      description: 'Build a production-ready REST API with Node.js and Express.',
      thumbnail: 'https://picsum.photos/seed/nodejs/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: charlie.id,
      views: 31000,
    },
    {
      title: 'React Hooks Deep Dive',
      description: 'Understanding useState, useEffect, useContext, and custom hooks.',
      thumbnail: 'https://picsum.photos/seed/hooks/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: alice.id,
      views: 18900,
    },
    {
      title: 'Deploying Apps to Vercel',
      description: 'Deploy your Next.js app to Vercel in minutes.',
      thumbnail: 'https://picsum.photos/seed/vercel/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: bob.id,
      views: 5400,
    },
    {
      title: 'Tailwind CSS Crash Course',
      description: 'Learn Tailwind CSS utility-first framework quickly.',
      thumbnail: 'https://picsum.photos/seed/tailwind/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: charlie.id,
      views: 41200,
    },
    {
      title: 'Redux Toolkit Modern Guide',
      description: 'State management with Redux Toolkit and RTK Query.',
      thumbnail: 'https://picsum.photos/seed/redux/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: alice.id,
      views: 9800,
    },
    {
      title: 'Docker for Frontend Developers',
      description: 'Containerize your frontend apps with Docker.',
      thumbnail: 'https://picsum.photos/seed/docker/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: bob.id,
      views: 15600,
    },
    {
      title: 'Git & GitHub Advanced Tips',
      description: 'Pro tips for using Git and GitHub in your workflow.',
      thumbnail: 'https://picsum.photos/seed/github/640/360',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      userId: charlie.id,
      views: 27300,
    },
  ];

  const videos: Video[] = [];
  for (const v of sampleVideos) {
    const video = await prisma.video.create({ data: v });
    videos.push(video);
  }

  // Create subscriptions
  await prisma.subscription.create({
    data: { subscriberId: alice.id, channelId: bob.id },
  });
  await prisma.subscription.create({
    data: { subscriberId: alice.id, channelId: charlie.id },
  });
  await prisma.subscription.create({
    data: { subscriberId: bob.id, channelId: alice.id },
  });

  // Create some comments
  await prisma.comment.createMany({
    data: [
      { text: 'Great tutorial!', userId: bob.id, videoId: videos[0].id },
      { text: 'Very helpful, thanks!', userId: charlie.id, videoId: videos[0].id },
      { text: 'Nice explanation', userId: alice.id, videoId: videos[2].id },
      { text: 'Can you make a part 2?', userId: bob.id, videoId: videos[4].id },
    ],
  });

  // Create liked videos
  await prisma.likedVideo.createMany({
    data: [
      { userId: alice.id, videoId: videos[2].id },
      { userId: alice.id, videoId: videos[4].id },
      { userId: bob.id, videoId: videos[0].id },
      { userId: charlie.id, videoId: videos[0].id },
    ],
  });

  // Create history
  await prisma.history.createMany({
    data: [
      { userId: alice.id, videoId: videos[0].id },
      { userId: alice.id, videoId: videos[2].id },
      { userId: alice.id, videoId: videos[5].id },
    ],
  });

  console.log('✅ Seed data created successfully!');
  console.log(`   - 3 users (password: password123)`);
  console.log(`   - ${videos.length} videos`);
  console.log(`   - 3 subscriptions`);
  console.log(`   - 4 comments`);
  console.log(`   - 4 liked videos`);
  console.log(`   - 3 history entries`);
  console.log('');
  console.log('Test accounts:');
  console.log('  alice@example.com / password123');
  console.log('  bob@example.com / password123');
  console.log('  charlie@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
