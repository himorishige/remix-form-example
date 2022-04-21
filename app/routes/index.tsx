import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import type { Todo } from '~/models/task.server';
import { createTask, getTaskList } from '~/models/task.server';

export const loader: LoaderFunction = async () => {
  const todo = await getTaskList();
  return json(todo);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title');

  if (typeof title !== 'string' || title.length === 0) {
    return json({ errors: { title: 'Title is required' } }, { status: 400 });
  }

  return await createTask(title);
};

const Index = () => {
  const todo = useLoaderData<Todo[] | null>();

  if (!todo) return <div>no items</div>;

  return (
    <main>
      <h1>TODO</h1>
      <ul>
        {todo.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
        <li>
          <Form replace method="post">
            <input type="text" name="title" />
            <button type="submit">Add</button>
          </Form>
        </li>
      </ul>
    </main>
  );
};

export default Index;
