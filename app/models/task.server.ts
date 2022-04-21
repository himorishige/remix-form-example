import { client } from '~/utils/supabaseClient.server';

export type Todo = {
  id: number;
  title: string;
  created_at: string;
};

export const getTaskList = async () => {
  const { data: todo } = await client
    .from<Todo>('todo')
    .select('*')
    .order('created_at', { ascending: true });
  return todo;
};

export const createTask = async (title: string) => {
  const { data: todo } = await client.from<Todo>('todo').insert({ title });
  return todo;
};

export const deleteTask = async (id: number) => {
  const { data: todo } = await client.from<Todo>('todo').delete().eq('id', id);
  return todo;
};
