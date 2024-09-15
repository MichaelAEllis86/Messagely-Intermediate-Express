-- USE this file to recreate Michael Ellis student DB!!! Contains a few users and messages to have some data to work with.
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE messagely;
--
-- Name: messagely; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE messagely WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C.UTF-8';


\connect messagely

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    from_username text NOT NULL,
    to_username text NOT NULL,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    username text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, from_username, to_username, body, sent_at, read_at) FROM stdin;
1	mooks2022	annoyedgrunt	hello	2024-09-14 20:11:17.442436-04	\N
2	mooks2022	annoyedgrunt	zoom zoom zoom	2024-09-14 20:14:08.943585-04	\N
3	mooks2022	Simonsays	terrible song	2024-09-14 20:15:00.260295-04	\N
4	mooks2022	Simonsays	mmm bop	2024-09-14 20:15:09.184708-04	\N
5	apop	mooks2022	test test test test	2024-09-15 14:32:53.064473-04	2024-09-15 15:02:39.634061-04
6	apop	mooks2022	blue blast	2024-09-15 14:33:06.752862-04	2024-09-15 15:02:43.613073-04
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (username, password, first_name, last_name, phone, join_at, last_login_at) FROM stdin;
Simonsays	$2b$12$iu2gHXhjhF1jg/Ayn8xXJedRjNdFpYy220zlVJ5jgJuwycUE7ldDa	Simon	Cowell	9992696969	2024-09-14 14:31:19.286414	\N
annoyedgrunt	$2b$12$htMKi0OlN7S8Y6rexPLxAeIUppVeEhoQlJKYTUK8H/rX.VRQO332S	neil	cicierga	3404182443	2024-09-14 14:32:25.063734	\N
apop	$2b$12$f1n8elKtdc.N/MV2ppD5He0c8BDoSkw6tXXKjqMWNR6hWCeV8lyf2	simba	mufasa	01189998819991197253	2024-09-14 20:39:27.481505	2024-09-15 14:27:04.447594-04
mooks2022	$2b$12$oaOYlNGCKj.k9dmwhsHcO.ZaJqJIPBHDcHlZ/xQnR3/PemLOUnZZm	Michael	Ellis	8675309	2024-09-12 18:32:08.204178	2024-09-15 14:37:52.173029-04
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 6, true);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: messages messages_from_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_from_username_fkey FOREIGN KEY (from_username) REFERENCES public.users(username);


--
-- Name: messages messages_to_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_to_username_fkey FOREIGN KEY (to_username) REFERENCES public.users(username);


--
-- PostgreSQL database dump complete
--

