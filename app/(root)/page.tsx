import Link from 'next/link';

import HomeFilter from '@/components/filters/HomeFilter';
import LocalSearch from '@/components/search/LocalSearch';
import { Button } from '@/components/ui/button';

import ROUTES from '../constants/routes';

const questions = [
  {
    _id: '1',
    title: 'How to learn React?',
    description: 'I want to learn React, can anyone help me?',
    tags: [
      { _id: '1', name: 'react' },
      { _id: '2', name: 'javascript' },
    ],
    author: { _id: '1', name: 'John Doe' },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date('2023-05-15T09:24:00'),
    updatedAt: new Date('2023-06-15T09:24:00'),
  },
  {
    _id: '2',
    title: 'Best practices for Node.js?',
    description: 'What are the best practices for developing in Node.js?',
    tags: [
      { _id: '3', name: 'nodejs' },
      { _id: '2', name: 'javascript' },
    ],
    author: { _id: '2', name: 'Jane Smith' },
    upvotes: 25,
    answers: 7,
    views: 230,
    createdAt: new Date('2023-04-12T10:30:00'),
    updatedAt: new Date('2023-06-20T10:30:00'),
  },
  {
    _id: '3',
    title: 'Understanding async/await in JavaScript',
    description: 'Can someone explain async/await in simple terms?',
    tags: [
      { _id: '2', name: 'javascript' },
      { _id: '4', name: 'async-await' },
    ],
    author: { _id: '3', name: 'Alice Johnson' },
    upvotes: 45,
    answers: 9,
    views: 500,
    createdAt: new Date('2023-03-22T11:15:00'),
    updatedAt: new Date('2023-05-18T11:15:00'),
  },
  {
    _id: '4',
    title: 'What is the difference between SQL and NoSQL?',
    description:
      'I am confused about SQL and NoSQL databases. Which one should I use?',
    tags: [
      { _id: '5', name: 'sql' },
      { _id: '6', name: 'nosql' },
      { _id: '7', name: 'databases' },
    ],
    author: { _id: '4', name: 'Bob Brown' },
    upvotes: 15,
    answers: 4,
    views: 150,
    createdAt: new Date('2023-06-01T14:00:00'),
    updatedAt: new Date('2023-06-18T14:00:00'),
  },
  {
    _id: '5',
    title: 'How to deploy a web app on AWS?',
    description: 'Can anyone guide me on deploying a full-stack app on AWS?',
    tags: [
      { _id: '8', name: 'aws' },
      { _id: '9', name: 'deployment' },
      { _id: '10', name: 'cloud' },
    ],
    author: { _id: '5', name: 'Charlie Kim' },
    upvotes: 30,
    answers: 6,
    views: 400,
    createdAt: new Date('2023-04-28T16:40:00'),
    updatedAt: new Date('2023-05-10T16:40:00'),
  },
  {
    _id: '6',
    title: 'Tips for optimizing CSS performance',
    description:
      'What are some effective ways to optimize CSS for better performance?',
    tags: [
      { _id: '11', name: 'css' },
      { _id: '12', name: 'performance' },
    ],
    author: { _id: '6', name: 'Dana Lee' },
    upvotes: 12,
    answers: 3,
    views: 180,
    createdAt: new Date('2023-03-05T08:15:00'),
    updatedAt: new Date('2023-03-15T08:15:00'),
  },
  {
    _id: '7',
    title: 'How to create a REST API in Express?',
    description:
      'I need to create a REST API using Express. Any good resources?',
    tags: [
      { _id: '3', name: 'nodejs' },
      { _id: '13', name: 'express' },
      { _id: '14', name: 'rest-api' },
    ],
    author: { _id: '7', name: 'Eli Wang' },
    upvotes: 20,
    answers: 8,
    views: 320,
    createdAt: new Date('2023-02-18T19:45:00'),
    updatedAt: new Date('2023-02-28T19:45:00'),
  },
  {
    _id: '8',
    title: 'What is the best way to learn data structures?',
    description:
      'I am a beginner and looking to learn data structures. Any advice?',
    tags: [
      { _id: '15', name: 'data-structures' },
      { _id: '2', name: 'javascript' },
      { _id: '16', name: 'learning' },
    ],
    author: { _id: '8', name: 'Fiona Patel' },
    upvotes: 55,
    answers: 12,
    views: 610,
    createdAt: new Date('2023-01-15T07:30:00'),
    updatedAt: new Date('2023-02-20T07:30:00'),
  },
  {
    _id: '9',
    title: 'How does the JavaScript event loop work?',
    description:
      'I am trying to understand how the event loop works in JavaScript.',
    tags: [
      { _id: '2', name: 'javascript' },
      { _id: '17', name: 'event-loop' },
    ],
    author: { _id: '9', name: 'George Silva' },
    upvotes: 40,
    answers: 11,
    views: 450,
    createdAt: new Date('2023-07-05T12:00:00'),
    updatedAt: new Date('2023-07-15T12:00:00'),
  },
  {
    _id: '10',
    title: 'What is React hooks and how to use them?',
    description:
      'I am new to React. Can someone explain hooks and their usage?',
    tags: [
      { _id: '1', name: 'react' },
      { _id: '18', name: 'hooks' },
    ],
    author: { _id: '10', name: 'Helen Grant' },
    upvotes: 22,
    answers: 6,
    views: 370,
    createdAt: new Date('2023-06-25T10:20:00'),
    updatedAt: new Date('2023-07-01T10:20:00'),
  },
];

interface LocalSearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: LocalSearchParams) => {
  const { query = '', filter = '' } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    const matchesFilter = filter
      ? question.tags.some(
          (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
        )
      : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
};

export default Home;
