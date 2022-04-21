import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData, useTransition } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import type { Todo } from '~/models/task.server';
import { createTask, getTaskList, deleteTask } from '~/models/task.server';

export const loader: LoaderFunction = async () => {
  const todo = await getTaskList();
  return json(todo);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  switch (formData.get('action')) {
    case 'create': {
      const title = formData.get('title');
      if (typeof title !== 'string' || title.length === 0) {
        return json(
          { errors: { title: 'Title is required' } },
          { status: 400 }
        );
      }

      return await createTask(title);
    }

    case 'delete': {
      const id = formData.get('id');
      if (typeof id !== 'string' || id.length === 0) {
        return json({ errors: { title: 'Id is required' } }, { status: 400 });
      }

      return await deleteTask(Number(id));
    }

    default: {
      return json({ errors: { title: 'Unknown action' } }, { status: 400 });
    }
  }
};

const TodoPage = () => {
  const todo = useLoaderData<Todo[] | null>();
  const transition = useTransition();
  const isAdding =
    transition.state === 'submitting' &&
    transition.submission.formData.get('action') === 'create';
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      titleRef.current?.focus();
    }
  }, [isAdding]);

  if (!todo) return <div>no items</div>;

  return (
    <main>
      <h1>TODO</h1>
      <ul>
        {todo.map((item) => (
          <li key={item.id}>
            {item.title}
            <Form replace method="post" style={{ display: 'inline' }}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" name="action" value="delete">
                X
              </button>
            </Form>
          </li>
        ))}
        <li>
          <Form ref={formRef} replace method="post">
            <input ref={titleRef} type="text" name="title" />
            <button
              type="submit"
              name="action"
              value="create"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </Form>
        </li>
      </ul>
    </main>
  );
};

export default TodoPage;
