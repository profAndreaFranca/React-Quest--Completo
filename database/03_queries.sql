-- Aula 17: executar cada consulta separadamente no SQL Editor administrativo.

-- 1. Todos os projetos.
SELECT *
FROM public.projects;

-- 2. Projetos concluídos.
SELECT title, status
FROM public.projects
WHERE status = 'Concluído';

-- 3. Todas as missões.
SELECT title, xp, completed
FROM public.missions;

-- 4. Quantidade de projetos.
SELECT COUNT(*) AS total_projects
FROM public.projects;

-- 5. Missões concluídas.
SELECT title, xp
FROM public.missions
WHERE completed = true;

-- 6. Repetir após sair e voltar ao SQL Editor para conferir a persistência.
SELECT title
FROM public.projects;
