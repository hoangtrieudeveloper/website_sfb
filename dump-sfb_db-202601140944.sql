--
-- PostgreSQL database cluster dump
--

-- Started on 2026-01-14 09:44:57

\restrict pTqaLLBXtfoLTS1VAgzXNdnjut6tjSoHtv8Lqx7CzpRYYHJ1xbwgFEHdgd37kai

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








\unrestrict pTqaLLBXtfoLTS1VAgzXNdnjut6tjSoHtv8Lqx7CzpRYYHJ1xbwgFEHdgd37kai

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict 3jBOMGnpaoOi86qXAZsFaid3YB5zgRhadC6qUTy6VWDNOO0EqcM2FdhoPuw7HMR

-- Dumped from database version 16.11
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-14 09:44:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-01-14 09:44:58

--
-- PostgreSQL database dump complete
--

\unrestrict 3jBOMGnpaoOi86qXAZsFaid3YB5zgRhadC6qUTy6VWDNOO0EqcM2FdhoPuw7HMR

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict VxArw20GCzX7Ir3WXoWFQleS2KNDgZaE7cPK41Qdu3PfqqzupYgyVdIXiKhVdEs

-- Dumped from database version 16.11
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-14 09:44:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-01-14 09:44:58

--
-- PostgreSQL database dump complete
--

\unrestrict VxArw20GCzX7Ir3WXoWFQleS2KNDgZaE7cPK41Qdu3PfqqzupYgyVdIXiKhVdEs

--
-- Database "sfb_db" dump
--

--
-- PostgreSQL database dump
--

\restrict e1emlQPrrJiEvUw2cOMbfqGWqpy8KnzFN6A71tY4jXTdTAONxYpOGP6HWgnqaOc

-- Dumped from database version 16.11
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-14 09:44:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3980 (class 1262 OID 16384)
-- Name: sfb_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE sfb_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE sfb_db OWNER TO postgres;

\unrestrict e1emlQPrrJiEvUw2cOMbfqGWqpy8KnzFN6A71tY4jXTdTAONxYpOGP6HWgnqaOc
\connect sfb_db
\restrict e1emlQPrrJiEvUw2cOMbfqGWqpy8KnzFN6A71tY4jXTdTAONxYpOGP6HWgnqaOc

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 270 (class 1255 OID 16425)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 253 (class 1259 OID 20526)
-- Name: about_section_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.about_section_items (
    id integer NOT NULL,
    section_id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.about_section_items OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 20525)
-- Name: about_section_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.about_section_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_section_items_id_seq OWNER TO postgres;

--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 252
-- Name: about_section_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.about_section_items_id_seq OWNED BY public.about_section_items.id;


--
-- TOC entry 251 (class 1259 OID 20507)
-- Name: about_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.about_sections (
    id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.about_sections OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 20506)
-- Name: about_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.about_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_sections_id_seq OWNER TO postgres;

--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 250
-- Name: about_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.about_sections_id_seq OWNED BY public.about_sections.id;


--
-- TOC entry 257 (class 1259 OID 20570)
-- Name: career_section_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career_section_items (
    id integer NOT NULL,
    section_id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.career_section_items OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 20569)
-- Name: career_section_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_section_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_section_items_id_seq OWNER TO postgres;

--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 256
-- Name: career_section_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_section_items_id_seq OWNED BY public.career_section_items.id;


--
-- TOC entry 255 (class 1259 OID 20551)
-- Name: career_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career_sections (
    id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.career_sections OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 20550)
-- Name: career_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_sections_id_seq OWNER TO postgres;

--
-- TOC entry 3984 (class 0 OID 0)
-- Dependencies: 254
-- Name: career_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_sections_id_seq OWNED BY public.career_sections.id;


--
-- TOC entry 265 (class 1259 OID 20658)
-- Name: contact_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_requests (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    company character varying(255),
    service character varying(255) NOT NULL,
    message text NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.contact_requests OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 20657)
-- Name: contact_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_requests_id_seq OWNER TO postgres;

--
-- TOC entry 3985 (class 0 OID 0)
-- Dependencies: 264
-- Name: contact_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_requests_id_seq OWNED BY public.contact_requests.id;


--
-- TOC entry 263 (class 1259 OID 20633)
-- Name: contact_section_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_section_items (
    id integer NOT NULL,
    section_id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact_section_items OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 20632)
-- Name: contact_section_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_section_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_section_items_id_seq OWNER TO postgres;

--
-- TOC entry 3986 (class 0 OID 0)
-- Dependencies: 262
-- Name: contact_section_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_section_items_id_seq OWNED BY public.contact_section_items.id;


--
-- TOC entry 261 (class 1259 OID 20614)
-- Name: contact_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_sections (
    id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact_sections OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 20613)
-- Name: contact_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_sections_id_seq OWNER TO postgres;

--
-- TOC entry 3987 (class 0 OID 0)
-- Dependencies: 260
-- Name: contact_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_sections_id_seq OWNED BY public.contact_sections.id;


--
-- TOC entry 259 (class 1259 OID 20595)
-- Name: homepage_blocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.homepage_blocks (
    id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.homepage_blocks OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 20594)
-- Name: homepage_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.homepage_blocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.homepage_blocks_id_seq OWNER TO postgres;

--
-- TOC entry 3988 (class 0 OID 0)
-- Dependencies: 258
-- Name: homepage_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.homepage_blocks_id_seq OWNED BY public.homepage_blocks.id;


--
-- TOC entry 245 (class 1259 OID 20446)
-- Name: industries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industries (
    id integer NOT NULL,
    icon_name character varying(100),
    title character varying(255) NOT NULL,
    short text,
    points jsonb DEFAULT '[]'::jsonb,
    gradient character varying(255),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.industries OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 20445)
-- Name: industries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.industries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.industries_id_seq OWNER TO postgres;

--
-- TOC entry 3989 (class 0 OID 0)
-- Dependencies: 244
-- Name: industries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.industries_id_seq OWNED BY public.industries.id;


--
-- TOC entry 249 (class 1259 OID 20482)
-- Name: industries_section_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industries_section_items (
    id integer NOT NULL,
    section_id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.industries_section_items OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 20481)
-- Name: industries_section_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.industries_section_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.industries_section_items_id_seq OWNER TO postgres;

--
-- TOC entry 3990 (class 0 OID 0)
-- Dependencies: 248
-- Name: industries_section_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.industries_section_items_id_seq OWNED BY public.industries_section_items.id;


--
-- TOC entry 247 (class 1259 OID 20463)
-- Name: industries_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industries_sections (
    id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.industries_sections OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 20462)
-- Name: industries_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.industries_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.industries_sections_id_seq OWNER TO postgres;

--
-- TOC entry 3991 (class 0 OID 0)
-- Dependencies: 246
-- Name: industries_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.industries_sections_id_seq OWNED BY public.industries_sections.id;


--
-- TOC entry 231 (class 1259 OID 20276)
-- Name: media_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_files (
    id integer NOT NULL,
    folder_id integer,
    filename character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_url character varying(500) NOT NULL,
    file_type character varying(50) NOT NULL,
    mime_type character varying(100) NOT NULL,
    file_size bigint NOT NULL,
    width integer,
    height integer,
    alt_text text,
    description text,
    uploaded_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.media_files OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 20275)
-- Name: media_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_files_id_seq OWNER TO postgres;

--
-- TOC entry 3992 (class 0 OID 0)
-- Dependencies: 230
-- Name: media_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_files_id_seq OWNED BY public.media_files.id;


--
-- TOC entry 229 (class 1259 OID 20255)
-- Name: media_folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_folders (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    parent_id integer,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.media_folders OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 20254)
-- Name: media_folders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_folders_id_seq OWNER TO postgres;

--
-- TOC entry 3993 (class 0 OID 0)
-- Dependencies: 228
-- Name: media_folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_folders_id_seq OWNED BY public.media_folders.id;


--
-- TOC entry 227 (class 1259 OID 20234)
-- Name: menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    url text NOT NULL,
    parent_id integer,
    sort_order integer DEFAULT 0,
    icon character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.menus OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 20233)
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO postgres;

--
-- TOC entry 3994 (class 0 OID 0)
-- Dependencies: 226
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- TOC entry 225 (class 1259 OID 20203)
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255),
    excerpt text,
    content text,
    category character varying(255),
    category_id character varying(100),
    status character varying(20) DEFAULT 'draft'::character varying,
    image_url text,
    author character varying(255),
    read_time character varying(100),
    gradient character varying(255),
    seo_title character varying(255),
    seo_description text,
    seo_keywords text,
    is_featured boolean DEFAULT false,
    gallery_title text,
    gallery_images jsonb,
    gallery_position character varying(20),
    show_table_of_contents boolean DEFAULT true,
    enable_share_buttons boolean DEFAULT true,
    show_author_box boolean DEFAULT true,
    highlight_first_paragraph boolean DEFAULT false,
    published_date date DEFAULT CURRENT_DATE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT news_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'published'::character varying])::text[])))
);


ALTER TABLE public.news OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 20186)
-- Name: news_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_categories (
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    parent_code character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.news_categories OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 20202)
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO postgres;

--
-- TOC entry 3995 (class 0 OID 0)
-- Dependencies: 224
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- TOC entry 220 (class 1259 OID 20148)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    module character varying(100),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 20147)
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- TOC entry 3996 (class 0 OID 0)
-- Dependencies: 219
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- TOC entry 233 (class 1259 OID 20302)
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    id integer NOT NULL,
    slug character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    icon_name character varying(100),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 20301)
-- Name: product_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_categories_id_seq OWNER TO postgres;

--
-- TOC entry 3997 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_categories_id_seq OWNED BY public.product_categories.id;


--
-- TOC entry 237 (class 1259 OID 20349)
-- Name: product_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_details (
    id integer NOT NULL,
    product_id integer NOT NULL,
    slug character varying(255) NOT NULL,
    meta_top character varying(255),
    hero_description text,
    hero_image text,
    cta_contact_text character varying(255),
    cta_contact_href character varying(255),
    cta_demo_text character varying(255),
    cta_demo_href character varying(255),
    overview_kicker character varying(255),
    overview_title character varying(255),
    showcase_title character varying(255),
    showcase_desc text,
    showcase_cta_text character varying(255),
    showcase_cta_href character varying(255),
    showcase_image_back text,
    showcase_image_front text,
    expand_title character varying(255),
    expand_cta_text character varying(255),
    expand_cta_href character varying(255),
    expand_image text,
    content_mode character varying(20) DEFAULT 'config'::character varying,
    content_html text,
    gallery_title text,
    gallery_images jsonb,
    gallery_position character varying(20) DEFAULT 'top'::character varying,
    show_table_of_contents boolean DEFAULT true,
    enable_share_buttons boolean DEFAULT true,
    show_author_box boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_details OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 20348)
-- Name: product_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_details_id_seq OWNER TO postgres;

--
-- TOC entry 3998 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_details_id_seq OWNED BY public.product_details.id;


--
-- TOC entry 235 (class 1259 OID 20319)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    category_id integer,
    slug character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    tagline character varying(500),
    meta character varying(255),
    description text,
    image text,
    gradient character varying(255),
    pricing character varying(255),
    badge character varying(255),
    stats_users character varying(255),
    stats_rating numeric(3,1),
    stats_deploy character varying(255),
    features jsonb DEFAULT '[]'::jsonb,
    demo_link character varying(500),
    seo_title character varying(255),
    seo_description text,
    seo_keywords text,
    sort_order integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 20318)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3999 (class 0 OID 0)
-- Dependencies: 234
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 241 (class 1259 OID 20396)
-- Name: products_section_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_section_items (
    id integer NOT NULL,
    section_id integer,
    product_detail_id integer,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_section_items_parent_check CHECK ((((section_id IS NOT NULL) AND (product_detail_id IS NULL)) OR ((section_id IS NULL) AND (product_detail_id IS NOT NULL))))
);


ALTER TABLE public.products_section_items OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 20395)
-- Name: products_section_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_section_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_section_items_id_seq OWNER TO postgres;

--
-- TOC entry 4000 (class 0 OID 0)
-- Dependencies: 240
-- Name: products_section_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_section_items_id_seq OWNED BY public.products_section_items.id;


--
-- TOC entry 239 (class 1259 OID 20377)
-- Name: products_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_sections (
    id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products_sections OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 20376)
-- Name: products_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_sections_id_seq OWNER TO postgres;

--
-- TOC entry 4001 (class 0 OID 0)
-- Dependencies: 238
-- Name: products_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_sections_id_seq OWNED BY public.products_sections.id;


--
-- TOC entry 222 (class 1259 OID 20165)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 20164)
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permissions_id_seq OWNER TO postgres;

--
-- TOC entry 4002 (class 0 OID 0)
-- Dependencies: 221
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- TOC entry 216 (class 1259 OID 20107)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 20106)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4003 (class 0 OID 0)
-- Dependencies: 215
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 267 (class 1259 OID 20675)
-- Name: seo_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seo_pages (
    id integer NOT NULL,
    page_path character varying(255) NOT NULL,
    page_type character varying(50),
    title character varying(255),
    description text,
    keywords text,
    og_title character varying(255),
    og_description text,
    og_image text,
    og_type character varying(50) DEFAULT 'website'::character varying,
    twitter_card character varying(20) DEFAULT 'summary_large_image'::character varying,
    twitter_title character varying(255),
    twitter_description text,
    twitter_image text,
    canonical_url text,
    robots_index boolean DEFAULT true,
    robots_follow boolean DEFAULT true,
    robots_noarchive boolean DEFAULT false,
    robots_nosnippet boolean DEFAULT false,
    structured_data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.seo_pages OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 20674)
-- Name: seo_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seo_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seo_pages_id_seq OWNER TO postgres;

--
-- TOC entry 4004 (class 0 OID 0)
-- Dependencies: 266
-- Name: seo_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seo_pages_id_seq OWNED BY public.seo_pages.id;


--
-- TOC entry 269 (class 1259 OID 20698)
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value text,
    setting_type character varying(50) DEFAULT 'text'::character varying,
    description text,
    category character varying(50) DEFAULT 'general'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 20697)
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO postgres;

--
-- TOC entry 4005 (class 0 OID 0)
-- Dependencies: 268
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- TOC entry 243 (class 1259 OID 20428)
-- Name: testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    quote text NOT NULL,
    author character varying(255) NOT NULL,
    company character varying(255),
    rating integer DEFAULT 5,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT testimonials_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.testimonials OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 20427)
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.testimonials_id_seq OWNER TO postgres;

--
-- TOC entry 4006 (class 0 OID 0)
-- Dependencies: 242
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- TOC entry 218 (class 1259 OID 20124)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    role_id integer NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 20123)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4007 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3497 (class 2604 OID 20529)
-- Name: about_section_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_section_items ALTER COLUMN id SET DEFAULT nextval('public.about_section_items_id_seq'::regclass);


--
-- TOC entry 3492 (class 2604 OID 20510)
-- Name: about_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_sections ALTER COLUMN id SET DEFAULT nextval('public.about_sections_id_seq'::regclass);


--
-- TOC entry 3508 (class 2604 OID 20573)
-- Name: career_section_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_section_items ALTER COLUMN id SET DEFAULT nextval('public.career_section_items_id_seq'::regclass);


--
-- TOC entry 3503 (class 2604 OID 20554)
-- Name: career_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_sections ALTER COLUMN id SET DEFAULT nextval('public.career_sections_id_seq'::regclass);


--
-- TOC entry 3530 (class 2604 OID 20661)
-- Name: contact_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_requests ALTER COLUMN id SET DEFAULT nextval('public.contact_requests_id_seq'::regclass);


--
-- TOC entry 3524 (class 2604 OID 20636)
-- Name: contact_section_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_section_items ALTER COLUMN id SET DEFAULT nextval('public.contact_section_items_id_seq'::regclass);


--
-- TOC entry 3519 (class 2604 OID 20617)
-- Name: contact_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_sections ALTER COLUMN id SET DEFAULT nextval('public.contact_sections_id_seq'::regclass);


--
-- TOC entry 3514 (class 2604 OID 20598)
-- Name: homepage_blocks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homepage_blocks ALTER COLUMN id SET DEFAULT nextval('public.homepage_blocks_id_seq'::regclass);


--
-- TOC entry 3475 (class 2604 OID 20449)
-- Name: industries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries ALTER COLUMN id SET DEFAULT nextval('public.industries_id_seq'::regclass);


--
-- TOC entry 3486 (class 2604 OID 20485)
-- Name: industries_section_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries_section_items ALTER COLUMN id SET DEFAULT nextval('public.industries_section_items_id_seq'::regclass);


--
-- TOC entry 3481 (class 2604 OID 20466)
-- Name: industries_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries_sections ALTER COLUMN id SET DEFAULT nextval('public.industries_sections_id_seq'::regclass);


--
-- TOC entry 3435 (class 2604 OID 20279)
-- Name: media_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_files ALTER COLUMN id SET DEFAULT nextval('public.media_files_id_seq'::regclass);


--
-- TOC entry 3432 (class 2604 OID 20258)
-- Name: media_folders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_folders ALTER COLUMN id SET DEFAULT nextval('public.media_folders_id_seq'::regclass);


--
-- TOC entry 3427 (class 2604 OID 20237)
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- TOC entry 3417 (class 2604 OID 20206)
-- Name: news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- TOC entry 3408 (class 2604 OID 20151)
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- TOC entry 3438 (class 2604 OID 20305)
-- Name: product_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories ALTER COLUMN id SET DEFAULT nextval('public.product_categories_id_seq'::regclass);


--
-- TOC entry 3450 (class 2604 OID 20352)
-- Name: product_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_details ALTER COLUMN id SET DEFAULT nextval('public.product_details_id_seq'::regclass);


--
-- TOC entry 3443 (class 2604 OID 20322)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3463 (class 2604 OID 20399)
-- Name: products_section_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_section_items ALTER COLUMN id SET DEFAULT nextval('public.products_section_items_id_seq'::regclass);


--
-- TOC entry 3458 (class 2604 OID 20380)
-- Name: products_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_sections ALTER COLUMN id SET DEFAULT nextval('public.products_sections_id_seq'::regclass);


--
-- TOC entry 3412 (class 2604 OID 20168)
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- TOC entry 3399 (class 2604 OID 20110)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3534 (class 2604 OID 20678)
-- Name: seo_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_pages ALTER COLUMN id SET DEFAULT nextval('public.seo_pages_id_seq'::regclass);


--
-- TOC entry 3543 (class 2604 OID 20701)
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- TOC entry 3469 (class 2604 OID 20431)
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- TOC entry 3404 (class 2604 OID 20127)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3958 (class 0 OID 20526)
-- Dependencies: 253
-- Data for Name: about_section_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.about_section_items (id, section_id, section_type, data, sort_order, is_active, created_at, updated_at) FROM stdin;
1	2	company	{"text": "41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, Hà Nội.", "title": "Trụ sở", "iconName": "Building2", "isHighlight": false}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	2	company	{"text": "P303, Tầng 3, Khách sạn Thể Thao, 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.", "title": "Văn phòng", "iconName": "MapPin", "isHighlight": false}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	2	company	{"text": "0888 917 999", "title": "Hotline", "iconName": "Phone", "isHighlight": true}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	2	company	{"text": "info@sfb.vn", "title": "Email", "iconName": "Mail", "isHighlight": true}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	3	vision-mission	{"text": "Phát triển bền vững trên nền tảng tri thức"}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
6	3	vision-mission	{"text": "Kết hợp trí tuệ tập thể & sự nhiệt huyết của đội ngũ"}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
7	3	vision-mission	{"text": "Xây dựng hệ thống, sản phẩm có giá trị lâu dài"}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
8	3	vision-mission	{"text": "Cung cấp sản phẩm, dịch vụ tốt nhất dựa trên công nghệ mới"}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
9	3	vision-mission	{"text": "Tạo dựng niềm tin vững chắc với khách hàng & nhà đầu tư"}	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
10	3	vision-mission	{"text": "Chung tay cùng xã hội hướng tới nền công nghiệp 4.0"}	5	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
11	4	core-values	{"title": "Đổi mới sáng tạo", "gradient": "from-yellow-500 to-orange-500", "iconName": "Lightbulb", "description": "Luôn tìm kiếm giải pháp mới, áp dụng công nghệ tiên tiến vào sản phẩm & dịch vụ."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
12	4	core-values	{"title": "Tận tâm với khách hàng", "gradient": "from-rose-500 to-pink-500", "iconName": "Handshake", "description": "Đặt lợi ích khách hàng lên hàng đầu, cam kết đồng hành dài lâu."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
13	4	core-values	{"title": "Hợp tác & đồng hành", "gradient": "from-blue-500 to-cyan-500", "iconName": "Users", "description": "Làm việc nhóm chặt chẽ, cùng khách hàng xây dựng giải pháp phù hợp nhất."}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
14	4	core-values	{"title": "Trách nhiệm & minh bạch", "gradient": "from-emerald-500 to-teal-500", "iconName": "ShieldCheck", "description": "Tuân thủ cam kết, quy trình rõ ràng, không phát sinh chi phí thiếu minh bạch."}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
15	4	core-values	{"title": "Học hỏi không ngừng", "gradient": "from-purple-500 to-indigo-500", "iconName": "Database", "description": "Liên tục cập nhật xu hướng mới: Cloud, AI, Big Data, DevOps.."}	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
16	4	core-values	{"title": "Tư duy toàn cầu", "gradient": "from-indigo-500 to-blue-500", "iconName": "Globe2", "description": "Tiếp cận theo chuẩn quốc tế, sẵn sàng mở rộng sang các thị trường mới."}	5	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
17	5	milestones	{"icon": "🚀", "year": "2017", "title": "Thành lập SFBTECH.,JSC", "description": "Được cấp giấy chứng nhận đăng ký kinh doanh số 0107857710 bởi Sở KH&ĐT Hà Nội, bắt đầu hoạt động theo mô hình công ty cổ phần."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
18	5	milestones	{"icon": "📘", "year": "2018-2019", "title": "Xây dựng đội ngũ & sản phẩm lõi", "description": "Hình thành các giải pháp về cổng thông tin điện tử, văn bản điều hành, thư viện số và các hệ thống nghiệp vụ cho cơ quan Nhà nước."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
19	5	milestones	{"icon": "📈", "year": "2020-2022", "title": "Mở rộng lĩnh vực & quy mô triển khai", "description": "Triển khai nhiều dự án cho khối Tài chính, Bảo hiểm, Ngân hàng, Viễn thông, Chính phủ điện tử và Doanh nghiệp."}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
20	5	milestones	{"icon": "🎯", "year": "2023 - nay", "title": "Tiếp tục tăng trưởng & chuyển đổi số", "description": "Đẩy mạnh các giải pháp theo nhu cầu riêng của từng đơn vị, chú trọng mở rộng, an toàn, bảo mật và tích hợp hệ thống."}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
21	6	leadership	{"name": "Nguyễn Văn Điền", "email": "diennv@sfb.vn", "image": "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg", "phone": "0888 917 999", "position": "KẾ TOÁN TRƯỞNG", "description": "Thành viên ban lãnh đạo phụ trách kế toán trưởng, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
22	6	leadership	{"name": "Nguyễn Đức Duy", "email": "duynd@sfb.vn", "image": "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg", "phone": "0705 146 789", "position": "GIÁM ĐỐC CÔNG NGHỆ", "description": "Thành viên ban lãnh đạo phụ trách giám đốc công nghệ, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
23	6	leadership	{"name": "Nguyễn Văn C", "email": "nvc@sfb.vn", "image": "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg", "phone": "0705 146 789", "position": "GIÁM ĐỐC KINH DOANH", "description": "Thành viên ban lãnh đạo phụ trách giám đốc kinh doanh, phối hợp chặt chẽ với các khối giải pháp, sản phẩm và vận hành."}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
24	6	leadership	{"name": "Lê Văn D", "email": "lvd@sfb.vn", "image": "https://sfb.vn/wp-content/uploads/2025/08/HA-500x500.jpg", "phone": "0987 654 321", "position": "GIÁM ĐỐC VẬN HÀNH", "description": "Thành viên ban lãnh đạo phụ trách vận hành và quy trình nội bộ, đảm bảo hiệu suất hoạt động tối ưu."}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
25	6	leadership	{"name": "Phạm Thị E", "email": "pte@sfb.vn", "image": "https://sfb.vn/wp-content/uploads/2020/04/ngvandien-500x500.jpg", "phone": "0123 456 789", "position": "GIÁM ĐỐC NHÂN SỰ", "description": "Thành viên ban lãnh đạo phụ trách phát triển nguồn nhân lực và văn hóa doanh nghiệp."}	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3956 (class 0 OID 20507)
-- Dependencies: 251
-- Data for Name: about_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.about_sections (id, section_type, data, is_active, created_at, updated_at) FROM stdin;
2	company	{"headerSub": "GIỚI THIỆU SFB", "contentTitle": "CÔNG TY CỔ PHẦN CÔNG NGHỆ SFB (SFB TECHNOLOGY JOINT STOCK COMPANY – viết tắt SFBTECH.,JSC)", "contactImage2": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", "contentImage1": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80", "headerTitleLine1": "Đối tác công nghệ chiến lược", "headerTitleLine2": "cho doanh nghiệp Việt", "contactButtonLink": "/contact", "contactButtonText": "Liên hệ ngay", "contentButtonLink": "/contact", "contentButtonText": "Liên hệ với chúng tôi", "contentDescription": "Công ty hoạt động theo mô hình cổ phần với giấy chứng nhận đăng ký kinh doanh số 0107857710 do Sở Kế hoạch và Đầu tư Hà Nội cấp ngày 24/05/2017."}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	vision-mission	{"headerTitle": "Tầm nhìn & Sứ mệnh", "headerDescription": "Trở thành một trong những công ty công nghệ hàng đầu về phát triển bền vững, xây dựng trên nền tảng tri thức và trí tuệ sáng tạo của đội ngũ nhân sự SFB."}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	core-values	{"headerTitle": "Giá trị cốt lõi", "headerDescription": "Những nguyên tắc định hình văn hoá và cách SFB hợp tác với khách hàng, đối tác và đội ngũ nội bộ"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	milestones	{"headerTitle": "Hành trình phát triển", "headerDescription": "Từ năm 2017 đến nay, SFB liên tục mở rộng đội ngũ, nâng cấp sản phẩm và chuẩn hóa dịch vụ để đồng hành cùng khách hàng lâu dài"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
6	leadership	{"headerTitle": "Ban lãnh đạo", "headerDescription": "Đội ngũ lãnh đạo chủ chốt của SFB Technology, định hướng chiến lược và đồng hành cùng khách hàng trong mọi dự án"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
1	hero	{"image": "/images/abouthero.png", "buttonLink": "/products", "buttonText": "KHÁM PHÁ GIẢI PHÁP", "titleLine1": "SFB Technology", "titleLine2": "Công ty cổ phần", "titleLine3": "công nghệ SFB", "description": "Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.", "backgroundGradient": "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)"}	t	2026-01-10 02:59:52.987173	2026-01-10 07:54:54.204232
\.


--
-- TOC entry 3962 (class 0 OID 20570)
-- Dependencies: 257
-- Data for Name: career_section_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_section_items (id, section_id, section_type, data, sort_order, is_active, created_at, updated_at) FROM stdin;
1	2	benefits	{"title": "Lương thưởng hấp dẫn", "gradient": "from-emerald-500 to-teal-500", "iconName": "DollarSign", "description": "Mức lương cạnh tranh top đầu thị trường, thưởng theo hiệu quả công việc"}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	2	benefits	{"title": "Thăng tiến rõ ràng", "gradient": "from-[#006FB3] to-[#0088D9]", "iconName": "TrendingUp", "description": "Lộ trình phát triển sự nghiệp minh bạch, đánh giá định kỳ 6 tháng"}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	2	benefits	{"title": "Môi trường năng động", "gradient": "from-orange-500 to-amber-500", "iconName": "Coffee", "description": "Văn hóa startup, không gian làm việc hiện đại, team building định kỳ"}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	2	benefits	{"title": "Chăm sóc sức khỏe", "gradient": "from-rose-500 to-pink-500", "iconName": "Heart", "description": "Bảo hiểm sức khỏe toàn diện, khám sức khỏe định kỳ, gym membership"}	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	2	benefits	{"title": "Công nghệ tiên tiến", "gradient": "from-purple-500 to-pink-500", "iconName": "Rocket", "description": "Làm việc với tech stack mới nhất, tham gia dự án quốc tế"}	5	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
6	2	benefits	{"title": "Đào tạo & phát triển", "gradient": "from-indigo-500 to-purple-500", "iconName": "Award", "description": "Ngân sách training unlimited, hỗ trợ certification & conference"}	6	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
7	3	positions	{"type": "Full-time", "title": "Senior Full-stack Developer", "salary": "2000 - 3500 USD", "skills": ["React", "Node.js", "AWS", "MongoDB"], "gradient": "from-[#006FB3] to-[#0088D9]", "location": "TP. HCM", "department": "Engineering", "experience": "4+ years", "description": "Phát triển và maintain các hệ thống enterprise cho khách hàng lớn. Lead team 3-5 developers."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
8	3	positions	{"type": "Full-time", "title": "Mobile Developer (Flutter)", "salary": "1500 - 2500 USD", "skills": ["Flutter", "Dart", "Firebase", "RESTful API"], "gradient": "from-purple-500 to-pink-500", "location": "TP. HCM / Remote", "department": "Engineering", "experience": "2+ years", "description": "Xây dựng mobile app cho các lĩnh vực fintech, e-commerce, healthcare."}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
9	3	positions	{"type": "Full-time", "title": "DevOps Engineer", "salary": "1800 - 3000 USD", "skills": ["AWS", "Kubernetes", "Docker", "Terraform"], "gradient": "from-emerald-500 to-teal-500", "location": "TP. HCM", "department": "Infrastructure", "experience": "3+ years", "description": "Quản lý infrastructure, CI/CD pipeline, monitoring và scaling hệ thống."}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
10	3	positions	{"type": "Full-time", "title": "UI/UX Designer", "salary": "1200 - 2000 USD", "skills": ["Figma", "Adobe XD", "Prototyping", "User Research"], "gradient": "from-orange-500 to-amber-500", "location": "TP. HCM", "department": "Design", "experience": "2+ years", "description": "Thiết kế giao diện và trải nghiệm người dùng cho web/mobile app."}	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
11	3	positions	{"type": "Full-time", "title": "Data Engineer", "salary": "2000 - 3200 USD", "skills": ["Python", "Spark", "Airflow", "SQL"], "gradient": "from-indigo-500 to-purple-500", "location": "TP. HCM", "department": "Data", "experience": "3+ years", "description": "Xây dựng data pipeline, ETL và data warehouse cho dự án Big Data."}	5	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
12	3	positions	{"type": "Full-time", "title": "QA Automation Engineer", "salary": "1000 - 1800 USD", "skills": ["Selenium", "Jest", "Cypress", "CI/CD"], "gradient": "from-rose-500 to-pink-500", "location": "TP. HCM / Remote", "department": "Quality Assurance", "experience": "2+ years", "description": "Phát triển automation test, đảm bảo chất lượng sản phẩm."}	6	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3960 (class 0 OID 20551)
-- Dependencies: 255
-- Data for Name: career_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_sections (id, section_type, data, is_active, created_at, updated_at) FROM stdin;
1	hero	{"image": "/images/hero.png", "buttonLink": "#positions", "buttonText": "Xem vị trí tuyển dụng", "titleLine1": "Cùng xây dựng", "titleLine2": "tương lai công nghệ", "description": "Gia nhập đội ngũ 50+ chuyên gia công nghệ, làm việc với tech stack hiện đại nhất và triển khai dự án cho các khách hàng lớn", "backgroundGradient": "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	benefits	{"headerTitle": "Phúc lợi & Đãi ngộ", "headerDescription": "Chúng tôi tin rằng nhân viên hạnh phúc sẽ làm việc hiệu quả hơn"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	positions	{"headerTitle": "Vị trí đang tuyển", "headerDescription": "Tìm vị trí phù hợp với bạn và ứng tuyển ngay hôm nay"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	cta	{"title": "Không tìm thấy vị trí phù hợp?", "description": "Gửi CV cho chúng tôi! Chúng tôi luôn tìm kiếm những tài năng xuất sắc", "primaryButtonLink": "mailto:careers@sfb.vn", "primaryButtonText": "Gửi CV qua email", "backgroundGradient": "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)", "secondaryButtonLink": "/contact", "secondaryButtonText": "Liên hệ HR"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3970 (class 0 OID 20658)
-- Dependencies: 265
-- Data for Name: contact_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_requests (id, name, email, phone, company, service, message, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3968 (class 0 OID 20633)
-- Dependencies: 263
-- Data for Name: contact_section_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_section_items (id, section_id, section_type, data, sort_order, is_active, created_at, updated_at) FROM stdin;
1	2	info-cards	{"link": "https://maps.google.com", "title": "Địa chỉ văn phòng", "content": "P303, Tầng 3, Khách sạn Thể Thao, Số 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.", "gradient": "from-blue-500 to-cyan-500", "iconName": "MapPin"}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	2	info-cards	{"link": "tel:+84888917999", "title": "Điện thoại", "content": "(+84) 888 917 999", "gradient": "from-emerald-500 to-teal-500", "iconName": "Phone"}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	2	info-cards	{"link": "mailto:info@sfb.vn", "title": "Email", "content": "info@sfb.vn", "gradient": "from-purple-500 to-pink-500", "iconName": "Mail"}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	2	info-cards	{"link": null, "title": "Giờ làm việc", "content": "T2 - T6: 8:00 - 17:30, T7: 8:00 - 12:00", "gradient": "from-orange-500 to-amber-500", "iconName": "Clock"}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
10	4	offices	{"city": "Hà Nội", "email": "info@sfb.vn", "phone": "(+84) 888 917 999", "address": "Số 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội."}	0	t	2026-01-12 07:42:55.91957	2026-01-12 07:42:55.91957
11	4	socials	{"href": "https://www.facebook.com/congtycpcnsfb", "label": "Facebook", "gradient": "from-blue-600 to-blue-700", "iconName": "Facebook"}	0	t	2026-01-12 07:42:55.91957	2026-01-12 07:42:55.91957
12	4	socials	{"href": "#", "label": "LinkedIn", "gradient": "from-blue-700 to-blue-800", "iconName": "Linkedin"}	1	t	2026-01-12 07:42:55.91957	2026-01-12 07:42:55.91957
13	4	socials	{"href": "#", "label": "Twitter", "gradient": "from-sky-500 to-sky-600", "iconName": "Twitter"}	2	t	2026-01-12 07:42:55.91957	2026-01-12 07:42:55.91957
14	4	socials	{"href": "#", "label": "YouTube", "gradient": "from-red-600 to-red-700", "iconName": "Youtube"}	3	t	2026-01-12 07:42:55.91957	2026-01-12 07:42:55.91957
\.


--
-- TOC entry 3966 (class 0 OID 20614)
-- Dependencies: 261
-- Data for Name: contact_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_sections (id, section_type, data, is_active, created_at, updated_at) FROM stdin;
2	info-cards	{}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	form	{"button": {"submit": "Gửi yêu cầu", "success": "Đã gửi thành công!"}, "fields": {"name": {"label": "Họ và tên", "placeholder": "Nguyễn Văn A"}, "email": {"label": "Email", "placeholder": "email@example.com"}, "phone": {"label": "Số điện thoại", "placeholder": "0901234567"}, "company": {"label": "Công ty", "placeholder": "Tên công ty"}, "message": {"label": "Nội dung", "placeholder": "Mô tả chi tiết nhu cầu của bạn..."}, "service": {"label": "Dịch vụ quan tâm", "placeholder": "Chọn dịch vụ"}}, "header": "Gửi yêu cầu tư vấn", "services": ["Cloud Computing", "Phát triển phần mềm", "Quản trị dữ liệu", "Business Intelligence", "AI & Machine Learning", "Cybersecurity", "Khác"], "description": "Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	map	{"address": "Khách sạn Thể Thao, P306, Tầng 3, Số 15 P. Lê Văn Thiêm, Thanh Xuân, Hà Nội", "iframeSrc": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7819253605126!2d105.8003122759699!3d21.001376980641176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc9f0d65555%3A0x6a092258a61f4c4a!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gQ8O0bmcgTmdo4buHIFNmYg!5e0!3m2!1svi!2s!4v1766463463476!5m2!1svi!2s"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
1	hero	{"badge": "LIÊN HỆ VỚI CHÚNG TÔI", "image": "https://beta.sfb.vn/uploads/news/card3-1768188461110-994876494.png", "title": {"prefix": "Hãy để chúng tôi", "highlight": "hỗ trợ bạn"}, "iconName": "MessageCircle", "description": "Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7"}	t	2026-01-10 02:59:52.987173	2026-01-12 03:27:43.157126
4	sidebar	{"quickActions": {"title": "Cần tư vấn ngay?", "buttons": {"hotline": {"href": "tel:+84888917999", "label": "Hotline", "value": "(+84) 888 917 999"}, "appointment": {"href": "#", "label": "Đặt lịch hẹn", "value": "Tư vấn 1-1 với chuyên gia"}}, "description": "Liên hệ trực tiếp với chúng tôi qua hotline hoặc đặt lịch hẹn tư vấn"}}	t	2026-01-10 02:59:52.987173	2026-01-12 07:42:55.91957
\.


--
-- TOC entry 3964 (class 0 OID 20595)
-- Dependencies: 259
-- Data for Name: homepage_blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.homepage_blocks (id, section_type, data, is_active, created_at, updated_at) FROM stdin;
2	aboutCompany	{"title": {"part1": "Chuyển đổi số ", "part2": " mà ", "part3": " của doanh nghiệp.", "highlight1": "không bắt đầu từ phần mềm", "highlight2": "từ hiệu quả thực tế"}, "slides": [{"image": "/images/card-consulting.jpg", "title": "Tư vấn & Đánh giá hiện trạng", "buttonLink": "/contact", "buttonText": "Nhận tư vấn ngay", "description": "Chúng tôi phân tích toàn diện hiện trạng vận hành, dữ liệu và quy trình của doanh nghiệp. Xác định điểm mạnh – điểm nghẽn – rủi ro tiềm ẩn để đưa ra bức tranh tổng thể."}, {"image": "/images/card-solution.png", "title": "Thiết kế giải pháp phù hợp", "buttonLink": "/products", "buttonText": "Xem case studies", "description": "Xây dựng giải pháp tối ưu dựa trên nhu cầu thực tế và đặc thù ngành. Đảm bảo tính linh hoạt, khả năng mở rộng và hiệu quả vận hành lâu dài."}, {"image": "/images/card-implementation.png", "title": "Triển khai & Tích hợp hệ thống", "buttonLink": "/solutions", "buttonText": "Tìm hiểu thêm", "description": "Thực hiện triển khai chuyên nghiệp, đảm bảo tiến độ và chất lượng. Kết nối liền mạch với các hệ thống hiện có để tối ưu vận hành tổng thể."}], "description": "SFB giúp doanh nghiệp vận hành thông minh, giảm chi phí hạ tầng, tăng năng suất và bảo mật dữ liệu an toàn tuyệt đối."}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	solutions	{"items": [{"id": 1, "title": "Quy trình được chuẩn hóa", "benefits": ["Minh bạch & dễ kiểm soát", "Giảm rủi ro dự án", "Chất lượng đồng nhất"], "iconName": "LineChart", "buttonLink": "/contact", "buttonText": "Tìm hiểu cách SFB triển khai", "description": "Tất cả công việc tại SFB đều được chuẩn hóa theo quy trình rõ ràng – từ tác vụ đơn giản đến các hạng mục phức tạp. Giúp kiểm soát chất lượng, tiến độ và rủi ro một cách nhất quán.", "iconGradient": "from-cyan-400 to-blue-600"}, {"id": 2, "title": "Công nghệ .Net của Microsoft", "benefits": ["Bảo mật cao", "Dễ bảo trì", "Hệ sinh thái mạnh"], "iconName": "Code", "buttonLink": "/industries", "buttonText": "Xem case studies", "description": "Nền tảng phát triển mạnh mẽ, đa ngôn ngữ và đa hệ điều hành, hỗ trợ xây dựng ứng dụng từ web, mobile đến enterprise. .NET mang lại hiệu suất cao, bảo mật và tốc độ triển khai tối ưu.", "iconGradient": "from-fuchsia-400 to-indigo-600"}, {"id": 3, "title": "Giải pháp lưu trữ hiện đại & Big Data", "benefits": ["Big Data-ready", "Hiệu năng cao", "An toàn dữ liệu"], "iconName": "Database", "buttonLink": "/contact", "buttonText": "Tư vấn miễn phí", "description": "Hạ tầng lưu trữ tiên tiến giúp xử lý và quản lý dữ liệu khổng lồ theo thời gian thực. Big Data cho phép phân tích sâu, phát hiện xu hướng và đưa ra quyết định dựa trên dữ liệu chính xác.", "iconGradient": "from-emerald-400 to-green-600"}, {"id": 4, "title": "Khả năng mở rộng linh hoạt", "benefits": ["n-Tier / n-Layer", "Dễ mở rộng", "Sẵn sàng quy mô lớn"], "iconName": "Cloud", "buttonLink": "/contact", "buttonText": "Tìm hiểu cách SFB triển khai", "description": "Hệ thống được thiết kế để dễ dàng mở rộng theo nhu cầu: từ tăng tải người dùng đến mở rộng dịch vụ. Kiến trúc linh hoạt giúp tối ưu hiệu năng và đảm bảo hoạt động ổn định ngay cả khi quy mô tăng nhanh.", "iconGradient": "from-orange-400 to-pink-600"}], "title": {"part1": "Giải pháp phần mềm", "part2": "đóng gói cho nhiều lĩnh vực"}, "domains": ["Chính phủ & cơ quan nhà nước", "Doanh nghiệp", "Ngân hàng & bảo hiểm", "Giáo dục & đào tạo", "Viễn thông & hạ tầng số"], "subHeader": "GIẢI PHÁP CHUYÊN NGHIỆP"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	trusts	{"image": "/images/card-consulting.jpg", "title": "Độ tin cậy của SFB Technology", "button": {"link": "/about", "text": "Tìm hiểu thêm"}, "features": [{"title": "Năng lực được chứng minh", "iconName": "BarChart3", "description": "Triển khai nhiều dự án quy mô lớn cho cơ quan Nhà nước, doanh nghiệp và tổ chức trong các lĩnh vực Tài chính, Ngân hàng, Giáo dục, Viễn thông, Công nghiệp."}, {"title": "Đội ngũ chuyên gia giàu kinh nghiệm", "iconName": "ShieldCheck", "description": "Chuyên gia nhiều năm trong phát triển phần mềm, bảo mật, hạ tầng số và thiết kế hệ thống."}, {"title": "Quy trình & cam kết minh bạch", "iconName": "FileCheck", "description": "Quy trình quản lý dự án rõ ràng, từ khảo sát đến vận hành, luôn minh bạch với khách hàng."}], "subHeader": "SFB TECHNOLOGY", "description": "Năng lực thực chiến, đội ngũ chuyên gia và quy trình minh bạch giúp SFB trở thành đối tác công nghệ tin cậy của hàng trăm tổ chức, doanh nghiệp."}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	features	{"block1": {"list": ["Tự tin trong các dự án phức tạp", "Tối ưu quy trình và chi phí", "Đồng hành trọn vòng đời sản phẩm"], "text": "SFB với kinh nghiệm qua nhiều dự án lớn nhỏ, tự tin xử lý các bài toán phần mềm phức tạp, yêu cầu chuyên môn sâu. Đội ngũ trẻ – đam mê – trách nhiệm giúp xây dựng hệ thống ổn định, hiệu quả và tối ưu chi phí.", "image": "/images/feature1.png", "button": {"link": "/about", "text": "Tìm hiểu thêm"}}, "block2": {"image": "/images/feature2.png", "items": [{"text": "Thực hiện hàng trăm dự án từ nhỏ tới lớn, phức tạp.", "title": "Nhiều năm kinh nghiệm"}, {"text": "Đội ngũ trẻ, chuyên sâu, giàu tinh thần trách nhiệm.", "title": "Nhân viên nhiệt huyết"}, {"text": "Đáp ứng yêu cầu khó, nghiệp vụ đa ngành.", "title": "Dự án lớn liên tục hoàn thành"}, {"text": "Hạ tầng server riêng, khả năng mở rộng tức thời.", "title": "Làm chủ công nghệ"}], "button": {"link": "/solutions", "text": "Tìm hiểu cách SFB triển khai"}}, "block3": {"image": "/images/feature3.png", "items": [{"text": "Cung cấp hệ thống hoạt động hiệu quả 24/7, đáp ứng mọi nghiệp vụ công nghệ thông tin.", "title": "Chúng tôi hiện diện để"}, {"text": "Lấy niềm tin khách hàng và uy tín thương hiệu làm triết lý kinh doanh.", "title": "Xây dựng niềm tin"}, {"text": "Đề cao trung thực – kinh nghiệm – sáng tạo – trách nhiệm.", "title": "Giá trị của nhân viên"}], "button": {"link": "/contact", "text": "Liên hệ với chúng tôi"}}, "blocks": [{"list": ["Tự tin trong các dự án phức tạp", "Tối ưu quy trình và chi phí", "Đồng hành trọn vòng đời sản phẩm"], "text": "SFB với kinh nghiệm qua nhiều dự án lớn nhỏ, tự tin xử lý các bài toán phần mềm phức tạp, yêu cầu chuyên môn sâu. Đội ngũ trẻ – đam mê – trách nhiệm giúp xây dựng hệ thống ổn định, hiệu quả và tối ưu chi phí.", "type": "type1", "image": "/images/feature1.png", "items": [], "button": {"link": "/about", "text": "Tìm hiểu thêm"}}, {"list": [], "text": "", "type": "type2", "image": "/images/feature2.png", "items": [{"text": "Thực hiện hàng trăm dự án từ nhỏ tới lớn, phức tạp.", "title": "Nhiều năm kinh nghiệm"}, {"text": "Đội ngũ trẻ, chuyên sâu, giàu tinh thần trách nhiệm.", "title": "Nhân viên nhiệt huyết"}, {"text": "Đáp ứng yêu cầu khó, nghiệp vụ đa ngành.", "title": "Dự án lớn liên tục hoàn thành"}, {"text": "Hạ tầng server riêng, khả năng mở rộng tức thời.", "title": "Làm chủ công nghệ"}], "button": {"link": "/solutions", "text": "Tìm hiểu cách SFB triển khai"}}, {"list": [], "text": "", "type": "type2", "image": "/images/feature3.png", "items": [{"text": "Cung cấp hệ thống hoạt động hiệu quả 24/7, đáp ứng mọi nghiệp vụ công nghệ thông tin.", "title": "Chúng tôi hiện diện để"}, {"text": "Lấy niềm tin khách hàng và uy tín thương hiệu làm triết lý kinh doanh.", "title": "Xây dựng niềm tin"}, {"text": "Đề cao trung thực – kinh nghiệm – sáng tạo – trách nhiệm.", "title": "Giá trị của nhân viên"}], "button": {"link": "/contact", "text": "Liên hệ với chúng tôi"}}], "header": {"sub": "GIỚI THIỆU SFB", "title": "Chúng tôi là ai?", "description": "Đơn vị phát triển phần mềm với kinh nghiệm thực chiến, chuyên sâu công nghệ và định hướng xây dựng hệ thống bền vững."}}	t	2026-01-10 02:59:52.987173	2026-01-10 03:00:44.281459
6	testimonials	{"title": "Khách hàng nói về SFB?", "reviews": [{"id": 1, "quote": "Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.", "author": "Ông Nguyễn Hoàng Chinh", "rating": 5}, {"id": 2, "quote": "Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.", "author": "Ông Vũ Kim Trung", "rating": 5}, {"id": 3, "quote": "Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.", "author": "Ông Nguyễn Khánh Tùng", "rating": 5}, {"id": 4, "quote": "SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.", "author": "Ông Nguyễn Khanh", "rating": 5}]}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
7	consult	{"title": "Miễn phí tư vấn", "buttons": {"primary": {"link": "/contact", "text": "Tư vấn miễn phí ngay"}, "secondary": {"link": "/solutions", "text": "Xem case studies"}}, "description": "Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số."}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
1	hero	{"title": {"line1": "Chuyển đổi số ", "line2": "Thông minh", "line3": "Cho doanh nghiệp"}, "partners": ["/images/partners/baohiem.png", "/images/partners/botaichinh.png", "/images/partners/hvcsnd.png", "/images/partners/hưng-yên.png", "/images/partners/logo3.png", "/images/partners/namviet.png", "/images/partners/sotttt-removebg-preview.png", "/images/partners/usaid.png", "https://beta.sfb.vn/uploads/news/Emblem-of-Vietnam-1768013823748-60268748.svg", "https://beta.sfb.vn/uploads/news/logo-bao-hiem-xa-hoi-viet-nam-1768013973200-750148131.png", "https://beta.sfb.vn/uploads/news/Google--G--logo-svg-1768013983129-278123001.png", "https://beta.sfb.vn/uploads/news/Modern-google-drive--Logo-premium-vector-PNG-1768013992697-415545574.avif", "https://beta.sfb.vn/uploads/news/logo-bao-hiem-xa-hoi-viet-nam-1768013998914-411093267.png"], "heroImage": "https://beta.sfb.vn/uploads/news/hero-1768184105145-419247030.png", "description": "SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến, tối ưu hóa quy trình và tăng trưởng bền vững.", "primaryButton": {"link": "https://beta.sfb.vn/products", "text": "Khám phá giải pháp"}, "secondaryButton": {"link": "https://beta.sfb.vn/uploads/media/2026-01-07-17h52-54-1767783181543-816988285.mp4", "text": "Xem video ", "type": "video"}}	t	2026-01-10 02:59:52.987173	2026-01-12 02:15:07.071722
\.


--
-- TOC entry 3950 (class 0 OID 20446)
-- Dependencies: 245
-- Data for Name: industries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.industries (id, icon_name, title, short, points, gradient, sort_order, is_active, created_at, updated_at) FROM stdin;
1	Code2	Phát triển phần mềm	Thiết kế & xây dựng các hệ thống phần mềm nghiệp vụ, web, mobile và sản phẩm đóng gói.	["Ứng dụng quản lý nghiệp vụ cho cơ quan, doanh nghiệp", "Web / portal nội bộ & bên ngoài", "Sản phẩm phần mềm đóng gói, triển khai nhanh"]	from-blue-500 to-cyan-500	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	MonitorSmartphone	Tư vấn xây dựng & phát triển hệ thống CNTT	Đồng hành từ khảo sát, tư vấn kiến trúc đến lộ trình triển khai tổng thể hệ thống CNTT.	["Khảo sát hiện trạng & nhu cầu nghiệp vụ", "Đề xuất kiến trúc hệ thống & lộ trình chuyển đổi số", "Tư vấn lựa chọn nền tảng công nghệ phù hợp"]	from-purple-500 to-pink-500	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	Network	Tích hợp hệ thống & quản trị vận hành	Kết nối các hệ thống hiện hữu, quản lý vận hành tập trung, an toàn và ổn định.	["Xây dựng nền tảng tích hợp dữ liệu & dịch vụ", "Kết nối các hệ thống lõi, ứng dụng vệ tinh", "Giám sát, vận hành hệ thống 24/7"]	from-emerald-500 to-teal-500	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	Globe2	Giải pháp cổng thông tin điện tử	Cổng thông tin cho tổ chức, doanh nghiệp với trải nghiệm người dùng hiện đại.	["Cổng thông tin nội bộ & đối ngoại", "Quản lý nội dung, tin tức, dịch vụ trực tuyến", "Tối ưu tra cứu, tìm kiếm & tra cứu hồ sơ"]	from-orange-500 to-amber-500	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	ShieldCheck	Cổng thông tin Chính phủ điện tử trên nền tảng SharePoint	Giải pháp chuyên sâu cho khối nhà nước dựa trên Microsoft SharePoint.	["Kiến trúc tuân thủ quy định Chính phủ điện tử", "Quy trình phê duyệt, luân chuyển hồ sơ điện tử", "Bảo mật cao, phân quyền chi tiết"]	from-sky-500 to-blue-600	5	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
6	Users	Outsourcing	Cung cấp đội ngũ phát triển phần mềm chuyên nghiệp, linh hoạt theo mô hình dự án.	["Team dev, BA, QA, DevOps theo yêu cầu", "Linh hoạt thời gian & hình thức hợp tác", "Đảm bảo quy trình & chất lượng theo tiêu chuẩn SFB"]	from-rose-500 to-pink-500	6	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
7	Code2	Phát triển phần mềm	Thiết kế & xây dựng các hệ thống phần mềm nghiệp vụ, web, mobile và sản phẩm đóng gói.	["Ứng dụng quản lý nghiệp vụ cho cơ quan, doanh nghiệp", "Web / portal nội bộ & bên ngoài", "Sản phẩm phần mềm đóng gói, triển khai nhanh"]	from-blue-500 to-cyan-500	1	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
8	MonitorSmartphone	Tư vấn xây dựng & phát triển hệ thống CNTT	Đồng hành từ khảo sát, tư vấn kiến trúc đến lộ trình triển khai tổng thể hệ thống CNTT.	["Khảo sát hiện trạng & nhu cầu nghiệp vụ", "Đề xuất kiến trúc hệ thống & lộ trình chuyển đổi số", "Tư vấn lựa chọn nền tảng công nghệ phù hợp"]	from-purple-500 to-pink-500	2	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
9	Network	Tích hợp hệ thống & quản trị vận hành	Kết nối các hệ thống hiện hữu, quản lý vận hành tập trung, an toàn và ổn định.	["Xây dựng nền tảng tích hợp dữ liệu & dịch vụ", "Kết nối các hệ thống lõi, ứng dụng vệ tinh", "Giám sát, vận hành hệ thống 24/7"]	from-emerald-500 to-teal-500	3	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
10	Globe2	Giải pháp cổng thông tin điện tử	Cổng thông tin cho tổ chức, doanh nghiệp với trải nghiệm người dùng hiện đại.	["Cổng thông tin nội bộ & đối ngoại", "Quản lý nội dung, tin tức, dịch vụ trực tuyến", "Tối ưu tra cứu, tìm kiếm & tra cứu hồ sơ"]	from-orange-500 to-amber-500	4	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
11	ShieldCheck	Cổng thông tin Chính phủ điện tử trên nền tảng SharePoint	Giải pháp chuyên sâu cho khối nhà nước dựa trên Microsoft SharePoint.	["Kiến trúc tuân thủ quy định Chính phủ điện tử", "Quy trình phê duyệt, luân chuyển hồ sơ điện tử", "Bảo mật cao, phân quyền chi tiết"]	from-sky-500 to-blue-600	5	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
12	Users	Outsourcing	Cung cấp đội ngũ phát triển phần mềm chuyên nghiệp, linh hoạt theo mô hình dự án.	["Team dev, BA, QA, DevOps theo yêu cầu", "Linh hoạt thời gian & hình thức hợp tác", "Đảm bảo quy trình & chất lượng theo tiêu chuẩn SFB"]	from-rose-500 to-pink-500	6	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
\.


--
-- TOC entry 3954 (class 0 OID 20482)
-- Dependencies: 249
-- Data for Name: industries_section_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.industries_section_items (id, section_id, section_type, data, sort_order, is_active, created_at, updated_at) FROM stdin;
1	1	hero	{"label": "Kinh nghiệm triển khai", "value": "8+ năm", "gradient": "from-blue-500 to-cyan-500", "iconName": "Award"}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	1	hero	{"label": "Dự án & triển khai thực tế", "value": "Hàng trăm", "gradient": "from-purple-500 to-pink-500", "iconName": "Target"}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	1	hero	{"label": "Cơ quan Nhà nước & doanh nghiệp", "value": "Nhiều đơn vị", "gradient": "from-emerald-500 to-teal-500", "iconName": "Users"}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
16	3	process	{"image": "/images/industries/industries1.png", "title": "Hiểu rõ đặc thù từng ngành", "button": {"link": "/contact", "text": "Liên hệ với chúng tôi", "iconName": "ArrowRight", "iconSize": 18}, "colors": {"check": "text-blue-600", "strip": "from-blue-500 via-cyan-500 to-sky-400", "border": "border-blue-100", "gradient": "from-blue-500 to-cyan-500", "shadowBase": "rgba(15,23,42,0.06)", "shadowHover": "rgba(37,99,235,0.18)"}, "points": ["Nắm bắt nhanh yêu cầu nghiệp vụ", "Giải pháp \\"fit\\" quy trình, không one-size-fits-all"], "stepId": "01", "iconName": "Target", "description": "Kinh nghiệm triển khai cho khối Nhà nước, giáo dục, y tế, doanh nghiệp giúp SFB nắm rõ quy định, quy trình và nhu cầu thực tế của từng đơn vị."}	0	t	2026-01-13 02:20:06.164785	2026-01-13 02:20:06.164785
17	3	process	{"image": "/images/industries/industries2.png", "title": "Đội ngũ chuyên gia đồng hành", "button": {"link": "/contact", "text": "Kết nối với chuyên gia", "iconName": "Phone", "iconSize": 18}, "colors": {"check": "text-emerald-600", "strip": "from-emerald-500 via-teal-500 to-cyan-400", "border": "border-emerald-100", "gradient": "from-emerald-500 to-teal-500", "shadowBase": "rgba(15,23,42,0.06)", "shadowHover": "rgba(16,185,129,0.22)"}, "points": ["Trao đổi trực tiếp với team tư vấn & triển khai", "Đào tạo & hỗ trợ sau khi go-live"], "stepId": "02", "iconName": "Users", "description": "Kết hợp BA, dev, QA, DevOps và chuyên gia nghiệp vụ theo từng lĩnh vực, hỗ trợ khách hàng từ giai đoạn ý tưởng đến vận hành."}	1	t	2026-01-13 02:20:06.164785	2026-01-13 02:20:06.164785
18	3	process	{"image": "/images/industries/industries3.png", "title": "Quy trình & chất lượng nhất quán", "button": {"link": "/contact", "text": "Tìm hiểu quy trình, nghiệp vụ", "iconName": "Sparkles", "iconSize": 18}, "colors": {"check": "text-purple-600", "strip": "from-purple-500 via-violet-500 to-pink-400", "border": "border-purple-100", "gradient": "from-purple-500 to-pink-500", "shadowBase": "rgba(15,23,42,0.06)", "shadowHover": "rgba(168,85,247,0.22)"}, "points": ["Quy trình rõ ràng, minh bạch tiến độ", "Dễ dàng mở rộng & bảo trì về sau"], "stepId": "03", "iconName": "Award", "description": "Áp dụng quy trình chuẩn trong phân tích, phát triển, kiểm thử và triển khai, đảm bảo mỗi dự án đều đạt chất lượng như cam kết."}	2	t	2026-01-13 02:20:06.164785	2026-01-13 02:20:06.164785
\.


--
-- TOC entry 3952 (class 0 OID 20463)
-- Dependencies: 247
-- Data for Name: industries_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.industries_sections (id, section_type, data, is_active, created_at, updated_at) FROM stdin;
1	hero	{"image": "/images/fieldhero.png", "buttonLink": "/solutions", "buttonText": "KHÁM PHÁ GIẢI PHÁP", "description": "Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với hàng trăm dự án triển khai thực tế.", "titlePrefix": "Giải pháp công nghệ tối ưu", "titleSuffix": "vận hành doanh nghiệp", "backgroundGradient": "linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	list-header	{"title": "Các lĩnh vực hoạt động & dịch vụ", "description": "Những mảng chuyên môn chính mà SFB đang cung cấp giải pháp và dịch vụ công nghệ thông tin cho cơ quan Nhà nước & doanh nghiệp"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	cta	{"title": "Miễn phí tư vấn", "description": "Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số.", "backgroundColor": "#29A3DD", "primaryButtonLink": "/contact", "primaryButtonText": "Tư vấn miễn phí ngay", "secondaryButtonLink": "/solutions", "secondaryButtonText": "Xem case studies"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	process-header	{"subtitle": "LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB", "titlePart1": "Vì sao SFB phù hợp cho", "titlePart2": "lĩnh vực khác nhau", "titleHighlight": "nhiều"}	t	2026-01-10 02:59:52.987173	2026-01-13 02:20:06.164785
\.


--
-- TOC entry 3936 (class 0 OID 20276)
-- Dependencies: 231
-- Data for Name: media_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media_files (id, folder_id, filename, original_name, file_path, file_url, file_type, mime_type, file_size, width, height, alt_text, description, uploaded_by, created_at, updated_at) FROM stdin;
1	\N	281263446-2531049330362009-2157110447604345758-n-1768204855321-453010158.jpg	281263446_2531049330362009_2157110447604345758_n.jpg	uploads/media/281263446-2531049330362009-2157110447604345758-n-1768204855321-453010158.jpg	/uploads/media/281263446-2531049330362009-2157110447604345758-n-1768204855321-453010158.jpg	image	image/jpeg	341010	2048	1536	\N	\N	\N	2026-01-12 08:00:55.327763	2026-01-12 08:00:55.327763
3	\N	3202929177225280386-1-1768293302195-441273897.mp4	3202929177225280386-1.mp4	uploads/media/3202929177225280386-1-1768293302195-441273897.mp4	/uploads/media/3202929177225280386-1-1768293302195-441273897.mp4	video	video/mp4	511117	\N	\N	\N	\N	\N	2026-01-13 08:35:02.199594	2026-01-13 08:35:02.199594
5	5	3202929177225280386-1-1768293612724-622052368.mp4	3202929177225280386-1.mp4	uploads/media/folder-5/3202929177225280386-1-1768293612724-622052368.mp4	/uploads/media/folder-5/3202929177225280386-1-1768293612724-622052368.mp4	video	video/mp4	511117	\N	\N	\N	\N	\N	2026-01-13 08:40:12.730342	2026-01-13 08:40:12.730342
6	5	2026-01-12-09h56-06-1768293678890-837909325.mp4	2026-01-12_09h56_06.mp4	uploads/media/folder-5/2026-01-12-09h56-06-1768293678890-837909325.mp4	/uploads/media/folder-5/2026-01-12-09h56-06-1768293678890-837909325.mp4	video	video/mp4	2392064	\N	\N	\N	\N	\N	2026-01-13 08:41:18.900335	2026-01-13 08:41:18.900335
\.


--
-- TOC entry 3934 (class 0 OID 20255)
-- Dependencies: 229
-- Data for Name: media_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media_folders (id, name, slug, parent_id, description, created_at, updated_at) FROM stdin;
1	Root	root	\N	Thư mục gốc	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	Images	images	\N	Thư mục chứa hình ảnh	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	Documents	documents	\N	Thư mục chứa tài liệu	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	Icons	icons	\N	Thư mục chứa icons	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	Projects	projects	\N	Thư mục dự án	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3932 (class 0 OID 20234)
-- Dependencies: 227
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menus (id, title, url, parent_id, sort_order, icon, is_active, created_at, updated_at) FROM stdin;
1	Trang chủ	/	\N	1	\N	t	2026-01-10 02:59:52.987173	2026-01-13 15:03:46.206041
3	Sản phẩm	/products	\N	3	\N	t	2026-01-10 02:59:52.987173	2026-01-13 15:03:46.209394
2	Giới thiệu	/about	\N	2	\N	t	2026-01-10 02:59:52.987173	2026-01-13 15:03:46.213642
4	Lĩnh vực	/industries	\N	4	\N	t	2026-01-10 02:59:52.987173	2026-01-13 15:03:46.216712
5	Tin tức	/news	\N	5	\N	t	2026-01-10 02:59:52.987173	2026-01-13 15:03:46.21947
6	Tuyển dụng	/careers	\N	6	\N	t	2026-01-10 02:59:52.987173	2026-01-13 15:03:46.221923
\.


--
-- TOC entry 3930 (class 0 OID 20203)
-- Dependencies: 225
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, slug, excerpt, content, category, category_id, status, image_url, author, read_time, gradient, seo_title, seo_description, seo_keywords, is_featured, gallery_title, gallery_images, gallery_position, show_table_of_contents, enable_share_buttons, show_author_box, highlight_first_paragraph, published_date, created_at, updated_at) FROM stdin;
11	Template SEO cho bài viết	template-seo-bai-viet	Mẫu cấu trúc SEO hiệu quả cho content	<p>Nội dung demo...</p>	Hướng dẫn	product	draft	https://beta.sfb.vn/uploads/news/hero-1768195181399-447539775.png	Content Team	5 phút đọc	from-cyan-600 to-blue-600	Template SEO	Mẫu cấu trúc SEO hiệu quả	seo, template, content	f		["https://beta.sfb.vn/uploads/news/281263446-2531049330362009-2157110447604345758-n-1768210686552-355973136.jpg"]	top	t	t	t	f	2026-01-04	2026-01-10 02:59:52.987173	2026-01-12 09:38:39.306529
7	Checklist go-live hệ thống mới	checklist-go-live	Những việc cần làm trước khi go-live	<p>Nội dung demo...</p>	Hướng dẫn	product	draft	/uploads/news/news1.png	SFB Technology	4 phút đọc	from-blue-600 to-cyan-600	Checklist go-live	Chuẩn bị go-live hệ thống mới	go-live, checklist, triển khai	f	\N	\N	\N	t	t	t	f	2026-01-07	2026-01-10 02:59:52.987173	2026-01-12 09:38:40.922019
6	Case study: Thành công với SFB Cloud	case-study-sfb-cloud	Khách hàng tăng 40% hiệu suất vận hành	<p>Nội dung demo...</p>	Kinh doanh	company	draft	/uploads/news/news3.png	SFB Technology	7 phút đọc	from-orange-600 to-amber-600	Case study SFB Cloud	Tăng 40% hiệu suất vận hành với SFB Cloud	case study, sfb cloud, hiệu suất	f	\N	\N	\N	t	t	t	f	2026-01-03	2026-01-10 02:59:52.987173	2026-01-12 09:38:41.814549
5	Cập nhật bảo mật quý này	cap-nhat-bao-mat-q1	Tổng hợp bản vá và khuyến nghị bảo mật	<p>Nội dung demo...</p>	Công nghệ	tech	draft	/uploads/news/news2.png	Security Team	3 phút đọc	from-red-600 to-rose-600	Cập nhật bảo mật	Bản vá và khuyến nghị bảo mật mới nhất	bảo mật, patch, khuyến nghị	f	\N	\N	\N	t	t	t	f	2026-01-05	2026-01-10 02:59:52.987173	2026-01-12 09:38:42.428561
4	Hướng dẫn triển khai CRM hiệu quả	huong-dan-trien-khai-crm	Các bước triển khai hệ thống CRM cho SME	<p>Nội dung demo...</p>	Hướng dẫn	product	draft	/uploads/news/news1.png	SFB Technology	6 phút đọc	from-emerald-600 to-teal-600	Triển khai CRM hiệu quả	Hướng dẫn các bước triển khai CRM cho SME	crm, hướng dẫn, sme	f	\N	\N	\N	t	t	t	f	2026-01-10	2026-01-10 02:59:52.987173	2026-01-12 09:38:43.268386
3	Ký kết hợp tác chuyển đổi số với đối tác A	chuyen-doi-so-doi-tac-a	Hợp tác chiến lược nâng cao năng lực số	<p>Nội dung demo...</p>	Kinh doanh	company	draft	/uploads/news/news3.png	SFB Technology	4 phút đọc	from-indigo-600 to-purple-600	Hợp tác chuyển đổi số	Đối tác A cùng SFB chuyển đổi số	chuyển đổi số, hợp tác, đối tác A	f	\N	\N	\N	t	t	t	f	2026-01-08	2026-01-10 02:59:52.987173	2026-01-12 09:38:43.681492
2	SFB ra mắt nền tảng Cloud thế hệ mới	sfb-cloud-gen-2	Nâng cấp hiệu năng và bảo mật cho doanh nghiệp	<p>Nội dung demo...</p>	Công nghệ	tech	draft	/uploads/news/news2.png	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600	SFB Cloud thế hệ mới	Hiệu năng và bảo mật vượt trội cho doanh nghiệp	sfb cloud, hiệu năng, bảo mật	f	\N	\N	\N	t	t	t	f	2026-01-09	2026-01-10 02:59:52.987173	2026-01-12 09:38:44.117084
10	Best practices bảo mật API	best-practices-bao-mat-api	Hướng dẫn bảo vệ API an toàn	<p>Nội dung demo...</p>	Công nghệ	tech	draft	https://beta.sfb.vn/uploads/news/bao-mat-api-la-gi-compressed-1768210945882-515895461.jpg	Security Team	8 phút đọc	from-indigo-600 to-purple-600	Best practices API security	Hướng dẫn bảo mật API an toàn	api security, best practices	f		["https://beta.sfb.vn/uploads/news/download-1768210937919-448381003.png"]	top	t	t	t	f	2026-01-02	2026-01-10 02:59:52.987173	2026-01-13 08:27:50.110833
9	Tối ưu chi phí hạ tầng	toi-uu-chi-phi-ha-tang	Kinh nghiệm giảm 25% chi phí cloud	<p>Nội dung demo...</p>	Kinh doanh	company	draft	https://beta.sfb.vn/uploads/news/photo-1703238000584-17032380006582073696634-1768210990483-155187189.webp	FinOps Team	6 phút đọc	from-emerald-600 to-teal-600	Tối ưu chi phí cloud	Giảm 25% chi phí hạ tầng cloud	finops, chi phí, cloud	f		["https://beta.sfb.vn/uploads/news/Toi-uu-hoa-chi-phi-co-so-ha-tang-dam-may-tam-quan-trong-va-lo-trinh-trien-khai-1-1024x541-png-1768210982277-865838190.webp"]	bottom	t	t	t	f	2026-01-06	2026-01-10 02:59:52.987173	2026-01-13 08:27:50.642485
8	Roadmap sản phẩm 2025	roadmap-san-pham-2025	Các mốc phát hành tính năng chính	<p>Nội dung demo...</p>	Công nghệ	tech	draft	https://beta.sfb.vn/uploads/news/productroadmap-illustration-1024x538-1587550308-1768211046284-228928068.jpg	Product Team	5 phút đọc	from-purple-600 to-pink-600	Roadmap sản phẩm 2025	Các mốc phát hành chính năm 2025	roadmap, sản phẩm, 2025	f		["https://beta.sfb.vn/uploads/news/product-roadmap-la-gi-1768211037540-809261347.jpg"]	bottom	t	t	t	f	2025-12-31	2026-01-10 02:59:52.987173	2026-01-13 08:27:51.673319
12	SFB – 5 năm một chặng đường	sfb-5-nam-mot-chang-duong-sfb-5-nam-mot-chang-duong-sfb-5-nam-mot-chang-duong-sfb-5-nam-mot-chang-duong-sfb-5-nam-mot-chang-duong-sfb-5-nam-mot-chang-duong-sfb-5-nam-mot-chang-duongsfb-5-nam-mot-chang-duongsfb-5-nam-mot-chang-duong	Trong thời gian tới, công ty sẽ tiếp tục cố gắng để nâng cao vị thế, song song với đó sẽ là những áp lực, những thử thách và khó khăn mới trên con đường phát triển này. Nhưng với niềm tin, sự quyết tâm, sự nhiệt tình cũng như tinh thần đoàn kết như một gia đình giữa ban lãnh đạo và tập thể nhân viên thì SFB tin rằng đó sẽ là cơ sở vững chắc để chúng ta cùng nhau vượt qua những thách thức, đạt được những thành tựu mới trong sự nghiệp kinh doanh.	<div style="color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span id="mtc-3441848727429">Trong thời gian tới, công ty sẽ tiếp tục cố gắng để nâng cao vị thế, song song với đó sẽ là những áp lực, những thử thách và khó khăn mới trên con đường phát triển này. Nhưng với niềm tin, sự quyết tâm, sự nhiệt tình cũng như tinh thần đoàn kết như một gia đình giữa ban lãnh đạo và tập thể nhân viên thì SFB tin rằng đó sẽ là cơ sở vững chắc để chúng ta cùng nhau vượt qua những thách thức, đạt được những thành tựu mới trong sự nghiệp kinh doanh.</span></div><div style="color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"></div><div style="color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span id="mtc-3441848727429"><img loading="lazy" class="aligncenter wp-image-2735 size-full" src="https://sfb.vn/wp-content/uploads/2022/05/z3441449669147_5527de76e508b8e0f7850ffd754d065f-scaled.jpg" alt="" width="2560" height="1920" srcset="https://sfb.vn/wp-content/uploads/2022/05/z3441449669147_5527de76e508b8e0f7850ffd754d065f-scaled.jpg 2560w, https://sfb.vn/wp-content/uploads/2022/05/z3441449669147_5527de76e508b8e0f7850ffd754d065f-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2022/05/z3441449669147_5527de76e508b8e0f7850ffd754d065f-1024x768.jpg 1024w, https://sfb.vn/wp-content/uploads/2022/05/z3441449669147_5527de76e508b8e0f7850ffd754d065f-768x576.jpg 768w, https://sfb.vn/wp-content/uploads/2022/05/z3441449669147_5527de76e508b8e0f7850ffd754d065f-1536x1152.jpg 1536w, https://sfb.vn/wp-content/uploads/2022/05/z3441449669147_5527de76e508b8e0f7850ffd754d065f-2048x1536.jpg 2048w" sizes="(max-width: 2560px) 100vw, 2560px" style="margin-right: auto; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 45.0878%; max-width: 100%;"></span></div><div style="color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><em>Các vị đối tác, khách hàng và toàn thể cán bộ nhân viên SFB cùng nhau nâng ly chúc mừng ngày sinh nhật SFB</em></div><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><p style="color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span id="mtc-3441848727429">Một lần nữa, xin được gửi những lời cảm ơn tới các vị đối tác, khách hàng và toàn thể cán bộ nhân viên đã làm nên một SFB có được như ngày hôm nay. Xin chúc tập thể công ty nhiều sức khỏe, thành công hơn nữa trong thời gian tới.</span></p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/281263446-2531049330362009-2157110447604345758-n-1768204458653-760336833.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		["https://beta.sfb.vn/uploads/news/281263446-2531049330362009-2157110447604345758-n-1768204393071-76284968.jpg", "https://beta.sfb.vn/uploads/news/281565662-2531049530361989-634004073075161478-n-379x631-1768292180404-960268521.jpg", "https://beta.sfb.vn/uploads/news/283554022-2531049660361976-4243271880719940675-n-379x631-1768292180432-705514085.jpg", "https://beta.sfb.vn/uploads/news/283714183-2531049280362014-3653503641293664163-n-379x631-1768292180452-791744417.jpg"]	bottom	f	t	t	f	2022-05-26	2026-01-12 07:54:24.789185	2026-01-13 08:23:16.153569
13	Sinh nhật lần thứ 8	sinh-nhat-lan-thu-8	Trải qua 8 năm hình thành và phát triển, từ những khởi đầu nhỏ bé, SFB đã không ngừng lớn mạnh vượt qua mọi khó khăn gian lao thử thách để trở thành một trong những công ty uy tín về lĩnh vực công nghệ thông tin như hiện tại.Thành công của SFB là sự đóng góp, cống hiến không ngừng không chỉ ban lãnh đạo mà toàn thể nhân sự SFB, các bạn là những anh hùng thầm lặng, miệt mài cống hiến cùng SFB vượt qua những khó khăn mang lại cho công ty những giá trị tốt nhất.	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;">Vào ngày&nbsp;<span style="font-family: arial, helvetica, sans-serif;">24 tháng 05 năm 2025, SFB đã tổ chức kỷ niệm sinh nhật lần thứ 8 tại hội trường KSTT, đánh dấu một hành trình đầy nỗ lực và phát triển của tập thể công ty.</span></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;">Buổi sinh nhật diễn ra trong không khí vui vẻ và tràn đầy cảm xúc với sự góp mặt của Ban lãnh đạo, toàn thể nhân viên cùng các khách mời thân thiết.&nbsp;</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;">Trải qua 8 năm hình thành và phát triển, từ những khởi đầu nhỏ bé, SFB đã không ngừng lớn mạnh&nbsp;<span style="font-family: arial, helvetica, sans-serif;">vượt qua mọi khó khăn gian lao thử thách để trở thành một trong những công ty uy tín về lĩnh vực công nghệ thông tin như hiện tại.Thành công của SFB là sự đóng góp, cống hiến không ngừng không chỉ ban lãnh đạo mà toàn thể nhân sự SFB, các bạn là những anh hùng thầm lặng, miệt mài cống hiến cùng SFB vượt qua những khó khăn mang lại cho công ty những giá trị tốt nhất.</span></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Nhìn lại hành trình đã qua, SFB tự hào với những thành tựu đã đạt được. Thời gian tiếp theo, chúng tôi sẽ tiếp tục thay đổi sứ mệnh của mình, SFB sẽ luôn đổi mới những phương pháp chiến lược để mọi công việc trở nên thuận lợi, tốt đẹp. Tôi tin rằng, với sự quyết tâm bền bỉ của toàn thể ban lãnh đạo cùng nhân sự SFB sẽ tạo nên một SFB lớn mạnh và chinh phục những đỉnh cao mới.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Thay mặt ban lãnh đạo công ty cảm ơn tất cả mọi người.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;"><em>Một số hình ảnh trong buổi tiệc sinh nhật:</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class="aligncenter wp-image-2987 " src="https://sfb.vn/wp-content/uploads/2025/05/z6640677483698_408a5419c430b529e0a457f0be7319aa.jpg" alt="" width="857" height="571" srcset="https://sfb.vn/wp-content/uploads/2025/05/z6640677483698_408a5419c430b529e0a457f0be7319aa.jpg 2560w, https://sfb.vn/wp-content/uploads/2025/05/z6640677483698_408a5419c430b529e0a457f0be7319aa-300x200.jpg 300w, https://sfb.vn/wp-content/uploads/2025/05/z6640677483698_408a5419c430b529e0a457f0be7319aa-1024x682.jpg 1024w, https://sfb.vn/wp-content/uploads/2025/05/z6640677483698_408a5419c430b529e0a457f0be7319aa-768x512.jpg 768w, https://sfb.vn/wp-content/uploads/2025/05/z6640677483698_408a5419c430b529e0a457f0be7319aa-1536x1024.jpg 1536w, https://sfb.vn/wp-content/uploads/2025/05/z6640677483698_408a5419c430b529e0a457f0be7319aa-2048x1365.jpg 2048w" sizes="(max-width: 857px) 100vw, 857px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><em><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Ban lãnh đạo SFB</span></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><img loading="lazy" class="wp-image-2988 aligncenter" src="https://sfb.vn/wp-content/uploads/2025/05/z6640677394790_686f31e426f43171b9e76b1152f2da67.jpg" alt="" width="852" height="568" srcset="https://sfb.vn/wp-content/uploads/2025/05/z6640677394790_686f31e426f43171b9e76b1152f2da67.jpg 2560w, https://sfb.vn/wp-content/uploads/2025/05/z6640677394790_686f31e426f43171b9e76b1152f2da67-300x200.jpg 300w, https://sfb.vn/wp-content/uploads/2025/05/z6640677394790_686f31e426f43171b9e76b1152f2da67-1024x683.jpg 1024w, https://sfb.vn/wp-content/uploads/2025/05/z6640677394790_686f31e426f43171b9e76b1152f2da67-768x512.jpg 768w, https://sfb.vn/wp-content/uploads/2025/05/z6640677394790_686f31e426f43171b9e76b1152f2da67-1536x1024.jpg 1536w, https://sfb.vn/wp-content/uploads/2025/05/z6640677394790_686f31e426f43171b9e76b1152f2da67-2048x1366.jpg 2048w" sizes="(max-width: 852px) 100vw, 852px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both;"></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><em><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Nhân sự SFB</span></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><img loading="lazy" class="wp-image-2989 aligncenter" src="https://sfb.vn/wp-content/uploads/2025/05/z6640677730016_b1a8c7e52fdf443bb456a065278f1dd9.jpg" alt="" width="884" height="589" srcset="https://sfb.vn/wp-content/uploads/2025/05/z6640677730016_b1a8c7e52fdf443bb456a065278f1dd9.jpg 2560w, https://sfb.vn/wp-content/uploads/2025/05/z6640677730016_b1a8c7e52fdf443bb456a065278f1dd9-300x200.jpg 300w, https://sfb.vn/wp-content/uploads/2025/05/z6640677730016_b1a8c7e52fdf443bb456a065278f1dd9-1024x683.jpg 1024w, https://sfb.vn/wp-content/uploads/2025/05/z6640677730016_b1a8c7e52fdf443bb456a065278f1dd9-768x512.jpg 768w, https://sfb.vn/wp-content/uploads/2025/05/z6640677730016_b1a8c7e52fdf443bb456a065278f1dd9-1536x1024.jpg 1536w, https://sfb.vn/wp-content/uploads/2025/05/z6640677730016_b1a8c7e52fdf443bb456a065278f1dd9-2048x1366.jpg 2048w" sizes="(max-width: 884px) 100vw, 884px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; width: 77.5207%; max-width: 100%; height: auto;"></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><em><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Đối tác và khách hàng thân thiết SFB&nbsp;</span></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><img loading="lazy" class="wp-image-2992 alignnone" src="https://sfb.vn/wp-content/uploads/2025/05/z6640676610575_a91bb28ce7815f60cfa1d83c50277d00-1024x683.jpg" alt="" width="887" height="591" srcset="https://sfb.vn/wp-content/uploads/2025/05/z6640676610575_a91bb28ce7815f60cfa1d83c50277d00-1024x683.jpg 1024w, https://sfb.vn/wp-content/uploads/2025/05/z6640676610575_a91bb28ce7815f60cfa1d83c50277d00-300x200.jpg 300w, https://sfb.vn/wp-content/uploads/2025/05/z6640676610575_a91bb28ce7815f60cfa1d83c50277d00-768x512.jpg 768w, https://sfb.vn/wp-content/uploads/2025/05/z6640676610575_a91bb28ce7815f60cfa1d83c50277d00-1536x1024.jpg 1536w, https://sfb.vn/wp-content/uploads/2025/05/z6640676610575_a91bb28ce7815f60cfa1d83c50277d00-2048x1366.jpg 2048w" sizes="(max-width: 887px) 100vw, 887px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; float: none; width: 64.2149%; max-width: 100%; height: auto;"><img loading="lazy" class="aligncenter wp-image-2993 " src="https://sfb.vn/wp-content/uploads/2025/05/z6640676805641_c8666a01353419d3d4224cf7218d0434-1024x683.jpg" alt="" width="883" height="589" srcset="https://sfb.vn/wp-content/uploads/2025/05/z6640676805641_c8666a01353419d3d4224cf7218d0434-1024x683.jpg 1024w, https://sfb.vn/wp-content/uploads/2025/05/z6640676805641_c8666a01353419d3d4224cf7218d0434-300x200.jpg 300w, https://sfb.vn/wp-content/uploads/2025/05/z6640676805641_c8666a01353419d3d4224cf7218d0434-768x512.jpg 768w, https://sfb.vn/wp-content/uploads/2025/05/z6640676805641_c8666a01353419d3d4224cf7218d0434-1536x1024.jpg 1536w, https://sfb.vn/wp-content/uploads/2025/05/z6640676805641_c8666a01353419d3d4224cf7218d0434-2048x1366.jpg 2048w" sizes="(max-width: 883px) 100vw, 883px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; width: 63.2231%; max-width: 100%; height: auto;"></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em>Giám đốc điều hành trao bằng khen và thưởng cho nhân viên thâm niên tại công ty</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">&nbsp;</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><img loading="lazy" class="aligncenter" src="https://sfb.vn/wp-content/uploads/2025/05/z6640679898168_1d6c05ca5d076a62b9606da4b9cc73d4.jpg" alt="" width="893" height="596" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; width: 61.6529%; max-width: 100%; height: auto;"></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><img loading="lazy" class="aligncenter wp-image-2991 " src="https://sfb.vn/wp-content/uploads/2025/05/z6640678464787_4ab88195f3b9bfe7cd3c698f7a85f48d-1024x683.jpg" alt="" width="885" height="590" srcset="https://sfb.vn/wp-content/uploads/2025/05/z6640678464787_4ab88195f3b9bfe7cd3c698f7a85f48d-1024x683.jpg 1024w, https://sfb.vn/wp-content/uploads/2025/05/z6640678464787_4ab88195f3b9bfe7cd3c698f7a85f48d-300x200.jpg 300w, https://sfb.vn/wp-content/uploads/2025/05/z6640678464787_4ab88195f3b9bfe7cd3c698f7a85f48d-768x512.jpg 768w, https://sfb.vn/wp-content/uploads/2025/05/z6640678464787_4ab88195f3b9bfe7cd3c698f7a85f48d-1536x1024.jpg 1536w, https://sfb.vn/wp-content/uploads/2025/05/z6640678464787_4ab88195f3b9bfe7cd3c698f7a85f48d-2048x1366.jpg 2048w" sizes="(max-width: 885px) 100vw, 885px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; width: 61.6529%; max-width: 100%; height: auto;"></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">&nbsp; &nbsp; &nbsp;&nbsp;<em>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Bữa cơm thân mật mừng sinh nhật SFB</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt;">Một lần nữa, xin chúc mừng sinh nhật lần thứ 8 của SFB! Cảm ơn toàn thể nhân viên, khách hàng và đối tác đã luôn đồng hành trên hành trình phát triển này!</span></p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/ADD-768x512-1768292747896-370680.png	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				t		[]	top	f	t	t	f	2025-05-28	2026-01-13 08:26:46.016896	2026-01-13 08:26:46.016896
1	Hệ thống tuyển sinh đầu cấp	he-thong-tuyen-sinh-dau-cap	Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.	<p><strong>1. Phần mềm tuyển sinh đầu cấp đối với nhà trường</strong></p><p>Là phần mềm được phát triển để phục vụ công tác tuyển sinh của trường học, đồng thời là công cụ để kết nối phụ huynh và nhà trường một cách chặt chẽ hơn. Các tiện ích khi sử dụng phần mềm:</p><ul><li>Tổ chức tuyển sinh đúng quy chế, đảm bảo tính chính xác, công bằng, khách quan.</li><li>Đảm bảo tiến độ tuyển sinh, hướng dẫn tuyển sinh đầy đủ, rõ ràng, công khai tạo thuận lợi cho học sinh và cha mẹ học sinh.</li><li>Quản lý chính xác số trẻ theo từng độ tuổi trên địa bàn, phân tuyến và giao chỉ tiêu tránh tình trạng quá tải ở các trường.</li><li>Góp phần nâng cao chất lượng giáo dục toàn diện ở các cấp học</li></ul><p><strong>2. Phần mềm tuyển sinh đầu cấp đối với phụ huynh</strong></p><ul><li>Phụ huynh có thể thực hiện đăng ký cho con em trên các thiết bị thông minh có thể truy cập internet.</li><li>Có thể tra cứu các thông tin học sinh, thông tin kỳ tuyển sinh, kết quả khi đăng ký.</li><li>Hệ thống hỗ trợ hướng dẫn sử dụng cụ thể, rõ ràng theo từng bước thực hiện<ul><li>Dễ dàng thực hiện</li><li>Đăng ký mọi lúc mọi nơi không cần đến trực tiếp nhà trường</li></ul></li></ul><p><strong>I. CÁC CHỨC NĂNG CHÍNH</strong></p><p>01. Chức năng quản lý thông tin kỳ tuyển sinh cho phép cán bộ quản lý thêm mới các kỳ theo năm học, cập nhật thông tin cơ bản của kỳ tuyển sinh như: địa bàn, năm sinh, thời gian trực tuyến, trực tiếp, điều kiện phân tuyến chỉ tiêu.</p><div class="not-prose my-4"><img src="/images/news/news5.png" alt="Bảng quản lý thông tin kỳ tuyển sinh" class="w-full h-auto rounded-xl border border-gray-200" /></div><p>02. Chức năng quản lý thông tin đăng ký trái tuyến cho phép theo dõi, phê duyệt chỉ tiêu học sinh đăng ký trái tuyến, từ đó theo dõi được số lượng chỉ tiêu, tránh thừa thiếu trên địa bàn</p><div class="not-prose my-4"><img src="/images/news/news6.png" alt="Bảng quản lý đăng ký trái tuyến" class="w-full h-auto rounded-xl border border-gray-200" /></div>	Sản phẩm & giải pháp	product	draft	https://beta.sfb.vn/uploads/news/thumbImage-1768210781824-74051310.jpg	SFB Technology	10 phút đọc	from-blue-600 to-cyan-600	Hệ thống tuyển sinh đầu cấp	Giải pháp phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh	tuyển sinh, giáo dục, phần mềm	t		[]	top	t	t	t	f	2025-08-07	2026-01-10 02:59:52.987173	2026-01-13 08:27:57.116023
14	Chúc mừng sinh nhật nhân sự tháng 10/2021 và chào mừng ngày phụ nữ Việt Nam 20/10	chuc-mung-sinh-nhat-nhan-vien-sfb-thang-102021-va-chao-mung-ngay-phu-nu-viet-nam-2010	Tháng Mười luôn đặc biệt vì trong tháng 10 này có ngày tôn vinh phụ nữ Việt Nam 20-10, và tháng Mười càng đặc biệt hơn vì trong gia đình SFB có rất nhiều anh chị em và các bạn mừng đón sinh nhật. 	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Tháng Mười đã về trong không khí đón cái se se lạnh của mùa đông, mang đầy sự ấm áp trong không khí đoàn viên cùng gia đình. Hơi ấm mùa đông đang bao trùm lấy không khí của đất trời và cả lòng người ngay lúc này đây….</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Tháng Mười luôn đặc biệt vì trong tháng 10 này có ngày tôn vinh phụ nữ Việt Nam 20-10, và tháng Mười càng đặc biệt hơn vì trong gia đình SFB có rất nhiều anh chị em và các bạn mừng đón sinh nhật. Chúng ta cùng nhau hát vang khúc hát mừng sinh nhật và cùng chung niềm vui với họ nhé.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-weight: 700;"><em>&nbsp;Happy birthday!!!</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;"><br></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-weight: 700;"><em>Đón tuổi mới ngập tràn niềm vui và hạnh phúc</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Gia đình SFB xin chúc các thành viên có một ngày sinh nhật thật ý nghĩa, vui vẻ, ấm áp, hạnh phúc bên gia đình và những người thân yêu.Chúc cho các chị em trong gia đình SFB ngày càng xinh đẹp và Đặc biệt các bạn sẽ có nhiều bước tiến trong công việc, đóng góp&nbsp; cho sự phát triển vững mạnh của SFB.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hòa chung niềm vui bước vào tuổi mới và hòa chung không khí ngày phụ nữ Việt Nam SFB cũng gửi tặng đến các thành viên những món quà nhỏ nhưng chứa đựng cả niềm chân thành và những lời chúc tốt đẹp nhất đến các bạn khi nhận được.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class=" wp-image-2657 aligncenter" src="https://sfb.vn/wp-content/uploads/2021/10/z2858959821082_b178a8cafdc8c7ec68959ccac66186ce-1-300x225.jpg" alt="" width="467" height="350" srcset="https://sfb.vn/wp-content/uploads/2021/10/z2858959821082_b178a8cafdc8c7ec68959ccac66186ce-1-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/10/z2858959821082_b178a8cafdc8c7ec68959ccac66186ce-1-1024x767.jpg 1024w, https://sfb.vn/wp-content/uploads/2021/10/z2858959821082_b178a8cafdc8c7ec68959ccac66186ce-1-768x575.jpg 768w, https://sfb.vn/wp-content/uploads/2021/10/z2858959821082_b178a8cafdc8c7ec68959ccac66186ce-1.jpg 1276w" sizes="(max-width: 467px) 100vw, 467px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; width: 66.6116%; max-width: 100%; height: auto;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-weight: 700;"><em>Món quà nhỏ trao tay</em></span><span style="font-weight: 700;"><em>&nbsp;chất chứa trong đó là cả tấm chân tình của gia đình SFB</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-weight: 700;"><em><img loading="lazy" class=" wp-image-2659 aligncenter" src="https://sfb.vn/wp-content/uploads/2021/10/z2858959825865_283f011ff3bfcafcc48dec100f360700-300x169.jpg" alt="" width="479" height="270" srcset="https://sfb.vn/wp-content/uploads/2021/10/z2858959825865_283f011ff3bfcafcc48dec100f360700-300x169.jpg 300w, https://sfb.vn/wp-content/uploads/2021/10/z2858959825865_283f011ff3bfcafcc48dec100f360700-1024x576.jpg 1024w, https://sfb.vn/wp-content/uploads/2021/10/z2858959825865_283f011ff3bfcafcc48dec100f360700-768x432.jpg 768w, https://sfb.vn/wp-content/uploads/2021/10/z2858959825865_283f011ff3bfcafcc48dec100f360700.jpg 1280w" sizes="(max-width: 479px) 100vw, 479px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; width: 67.1901%; max-width: 100%; height: auto;">Những món quà nhỏ này sẽ đem lại may mắn cho người nhận</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hoạt động này không chỉ thể hiện sự quan tâm của Ban Giám đốc&nbsp; đến với nhân viên mà còn là dịp để mọi cán bộ, nhân viên tìm hiểu về đời sống, tâm tư và nguyện vọng của đồng nghiệp. Đồng thời giúp cán bộ, nhân viên trong công ty có niềm tin, say mê hơn trong công việc và là cầu nối giữa SFB với tất cả các nhân viên.</p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/z2858959825865-283f011ff3bfcafcc48dec100f360700-768x432-1768293213680-763663815.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		[]	top	f	t	t	f	2021-10-20	2026-01-13 08:33:39.041042	2026-01-13 08:54:00.006065
16	Sinh nhật công ty SFB lần thứ 4	sinh-nhat-cong-ty-sfb-lan-thu-4	Tinh thần đoàn kết , sẻ chia, cùng nhau nỗ lực là nguồn sức mạnh lớn nhất tạo nên một SFB trưởng thành và vững chắc như ngày hôm nay.Mừng ngày kỷ niệm 4 năm thành lập công ty. Nhìn lại chặng đường đã đi qua SFB luôn tự hào vì có đội ngũ nhân viên năng động, nhiệt tình.Chặng đường tuổi cũ của SFB đã khép lại với những vết son chói lọi, hy vọng tuổi mới với SFB sẽ là một dải lụa đỏ kéo dài, lấp lánh kim cương	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Tinh thần đoàn kết , sẻ chia, cùng nhau nỗ lực là nguồn sức mạnh lớn nhất tạo nên một SFB trưởng thành và vững chắc như ngày hôm nay.Mừng ngày kỷ niệm 4 năm thành lập công ty.Nhìn lại chặng đường đã đi qua SFB luôn tự hào vì có đội ngũ nhân viên năng động, nhiệt tình.Chặng đường tuổi cũ của SFB đã khép lại với những vết son chói lọi, hy vọng tuổi mới với SFB sẽ là một dải lụa đỏ kéo dài, lấp lánh kim cương.Cảm ơn tất cả mọi người vì đã luôn cố gắng nỗ lực hoàn thành mục tiêu đã đặt ra, cảm ơn ban lãnh đạo đã đồng hành và dẫn dắt các anh em trong công ty gặt hái những thành công.Và hơn hết là cảm ơn những vị khách hàng đã, đang và sẽ mãi ủng hộ, tin tưởng SFB.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">.<img loading="lazy" class="alignnone wp-image-2571 size-large" src="https://sfb.vn/wp-content/uploads/2021/05/e5f5d33375d1808fd9c0-1024x768.jpg" alt="" width="1024" height="768" srcset="https://sfb.vn/wp-content/uploads/2021/05/e5f5d33375d1808fd9c0-1024x768.jpg 1024w, https://sfb.vn/wp-content/uploads/2021/05/e5f5d33375d1808fd9c0-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/05/e5f5d33375d1808fd9c0-768x576.jpg 768w, https://sfb.vn/wp-content/uploads/2021/05/e5f5d33375d1808fd9c0-1536x1152.jpg 1536w, https://sfb.vn/wp-content/uploads/2021/05/e5f5d33375d1808fd9c0-2048x1536.jpg 2048w" sizes="(max-width: 1024px) 100vw, 1024px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; float: none;"><img loading="lazy" class="alignnone wp-image-2573 size-large" src="https://sfb.vn/wp-content/uploads/2021/05/f87aed1b4bf9bea7e7e8-1-1024x768.jpg" alt="" width="1024" height="768" srcset="https://sfb.vn/wp-content/uploads/2021/05/f87aed1b4bf9bea7e7e8-1-1024x768.jpg 1024w, https://sfb.vn/wp-content/uploads/2021/05/f87aed1b4bf9bea7e7e8-1-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/05/f87aed1b4bf9bea7e7e8-1-768x576.jpg 768w, https://sfb.vn/wp-content/uploads/2021/05/f87aed1b4bf9bea7e7e8-1-1536x1152.jpg 1536w, https://sfb.vn/wp-content/uploads/2021/05/f87aed1b4bf9bea7e7e8-1.jpg 2048w" sizes="(max-width: 1024px) 100vw, 1024px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; float: none;"></p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/f87aed1b4bf9bea7e7e8-1-768x512-1768294689317-421140191.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		[]	top	f	t	t	f	2021-05-26	2026-01-13 08:58:16.360185	2026-01-13 08:58:16.360185
17	Đào tạo quản trị vận hành dự án "Xây dựng phần mềm quản lý KPI cá nhân" tại công ty điện lực Hưng Yên	dao-tao-quan-tri-van-hanh-du-an-xay-dung-phan-mem-quan-ly-kpi-ca-nhan-tai-cong-ty-dien-luc-hung-yen	Dự án ” Xây dựng phần mềm quản lý KPI cá nhân ” tại Công ty Điện Lực Hưng Yên cũng đang dần bước vào giai đoạn chuyển giao phần mềm và đi vào hoạt động. 	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Dự án ” Xây dựng phần mềm quản lý KPI cá nhân ” tại Công ty Điện Lực Hưng Yên cũng đang dần bước vào giai đoạn chuyển giao phần mềm và đi vào hoạt động. Đây cũng chính là dự án cực kỳ tâm huyết của các anh em trong đội ngũ công ty SFB, mặc dù gặp cũng không ít khó khăn và thử thách trong quá trình xây dựng dự án nhưng bù đắp lại là kết quả của dự án thành công ngoài mong đợi.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class="alignnone wp-image-2551 size-full" src="https://sfb.vn/wp-content/uploads/2021/05/167244481_4232405583439153_9021920452129156410_n.jpg" alt="" width="960" height="719" srcset="https://sfb.vn/wp-content/uploads/2021/05/167244481_4232405583439153_9021920452129156410_n.jpg 960w, https://sfb.vn/wp-content/uploads/2021/05/167244481_4232405583439153_9021920452129156410_n-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/05/167244481_4232405583439153_9021920452129156410_n-768x575.jpg 768w" sizes="(max-width: 960px) 100vw, 960px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; float: none; height: auto; width: 79.1736%; max-width: 100%;"><img loading="lazy" class="aligncenter wp-image-2552 size-full" src="https://sfb.vn/wp-content/uploads/2021/05/168328302_4232405456772499_2141004005901780879_n.jpg" alt="" width="719" height="960" srcset="https://sfb.vn/wp-content/uploads/2021/05/168328302_4232405456772499_2141004005901780879_n.jpg 719w, https://sfb.vn/wp-content/uploads/2021/05/168328302_4232405456772499_2141004005901780879_n-225x300.jpg 225w" sizes="(max-width: 719px) 100vw, 719px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 78.843%; max-width: 100%;"><img loading="lazy" class="aligncenter wp-image-2553 size-full" src="https://sfb.vn/wp-content/uploads/2021/05/168485431_4235348353144876_315793765633676075_n.jpg" alt="" width="960" height="720" srcset="https://sfb.vn/wp-content/uploads/2021/05/168485431_4235348353144876_315793765633676075_n.jpg 960w, https://sfb.vn/wp-content/uploads/2021/05/168485431_4235348353144876_315793765633676075_n-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/05/168485431_4235348353144876_315793765633676075_n-768x576.jpg 768w" sizes="(max-width: 960px) 100vw, 960px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 77.9339%; max-width: 100%;"><img loading="lazy" class="aligncenter wp-image-2554 size-full" src="https://sfb.vn/wp-content/uploads/2021/05/168725209_4232405660105812_2839762758137415955_n.jpg" alt="" width="960" height="719" srcset="https://sfb.vn/wp-content/uploads/2021/05/168725209_4232405660105812_2839762758137415955_n.jpg 960w, https://sfb.vn/wp-content/uploads/2021/05/168725209_4232405660105812_2839762758137415955_n-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/05/168725209_4232405660105812_2839762758137415955_n-768x575.jpg 768w" sizes="(max-width: 960px) 100vw, 960px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 78.0165%; max-width: 100%;"><img loading="lazy" class="aligncenter wp-image-2555 size-full" src="https://sfb.vn/wp-content/uploads/2021/05/169070263_4235348293144882_5425704595300042526_n.jpg" alt="" width="960" height="720" srcset="https://sfb.vn/wp-content/uploads/2021/05/169070263_4235348293144882_5425704595300042526_n.jpg 960w, https://sfb.vn/wp-content/uploads/2021/05/169070263_4235348293144882_5425704595300042526_n-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/05/169070263_4235348293144882_5425704595300042526_n-768x576.jpg 768w" sizes="(max-width: 960px) 100vw, 960px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 68.4298%; max-width: 100%;"><img loading="lazy" class="aligncenter wp-image-2556 size-full" src="https://sfb.vn/wp-content/uploads/2021/05/169134265_4238139172865794_230250937414182362_n.jpg" alt="" width="960" height="721" srcset="https://sfb.vn/wp-content/uploads/2021/05/169134265_4238139172865794_230250937414182362_n.jpg 960w, https://sfb.vn/wp-content/uploads/2021/05/169134265_4238139172865794_230250937414182362_n-300x225.jpg 300w, https://sfb.vn/wp-content/uploads/2021/05/169134265_4238139172865794_230250937414182362_n-768x577.jpg 768w" sizes="(max-width: 960px) 100vw, 960px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 64.4215%; max-width: 100%;"></p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/168725209-4232405660105812-2839762758137415955-n-768x512-1768294893728-442248507.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		[]	top	t	t	t	f	2021-04-14	2026-01-13 09:01:49.392858	2026-01-13 09:01:49.392858
19	Chúc mừng nhân viên xuất sắc tháng 11	chuc-mung-nhan-vien-xuat-sac-thang-11	Nhân lực là chìa khóa dẫn đến thành công của một doanh nghiệp, SFB và toàn thể nhân sự đã và đang đồng hành trên con đường phát triển phía trước	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Nhân lực là chìa khóa dẫn đến thành công của một doanh nghiệp, SFB và toàn thể nhân sự đã và đang đồng hành trên con đường phát triển phía trước. Tất cả mọi cố gắng và nhiệt huyết của mọi người đều được toàn thể Lãnh đạo trong công ty ghi nhận.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong tháng 11 SFB đã tuyên dương và khen thưởng đối với nhân sự đã vượt qua những thách thức trong công việc. Luôn sáng tạo và không ngừng phấn đấu để hoàn thành tốt công việc được giao. Ban lãnh đạo đã tuyên dương và khen thưởng đối với:</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; + Dương Tùng Lâm</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; + Phạm Thị Hương Lan</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; + Lê Thị Kim Anh</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; + Nguyễn Đẩu Dương</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Anh Hùng, Giám đốc công ty chia sẻ: ”SFB đã và đang trải quả “những bước đi chập chững của trẻ lên 3”, với những gian nan, khó khăn và vất vả để hòa nhập dần vào thị trường công nghệ thông tin Việt Nam trên mảng hành chính công. Tôi ghi nhận và chân thành cảm ơn sự cố gắng của toàn bộ anh em công ty. Trong đó, có những anh/em có bước tiến vượt trội về năng lực bản thân, vượt qua được vùng “safe zone” của chính mình! Tôi không tìm thấy lý do gì để không khích lệ những thành viên này!”</p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/SinhNh--tnhKa-scaled-768x512-1768295332845-845379435.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		["https://beta.sfb.vn/uploads/news/lien-hoan-768x576-1768300457779-496040842.jpg"]	bottom	t	t	t	f	2021-01-14	2026-01-13 09:09:16.911163	2026-01-13 10:34:23.488127
18	SFB tổng kết năm 2020	sfb-tong-ket-nam-2020	 Năm cũ đang dần khép lại, chuẩn bị cho một năm mới với bao điều mới mẻ đang chờ đợi. 	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;">Năm hết Tết đến</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;">Đón hên về nhà</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;">Quà cáp bao la</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;">Một nhà không đủ</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;">Vàng bạc đầy tủ</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;">Gia chủ phát tài.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp; &nbsp; &nbsp; &nbsp;Năm cũ đang dần khép lại, chuẩn bị cho một năm mới với bao điều mới mẻ đang chờ đợi. Tháng Mười Hai – tháng cuối cùng của năm, tháng của những cảm xúc mới, không khí mới. Tháng Mười Hai mang đến cho SFB nhiều cảm xúc đan xen lẫn lộn.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">SFB đã buổi tổng kết cuối năm ấm cúng bên nhau, tất cả các các thành viên cùng quây quần bên nhau để toàn thể công ty cùng nhau nhìn tổng kết lại chặng đường một năm đã qua. Và cũng là dịp để ban lãnh đạo công ty gửi lời cảm ơn tới toàn thể nhân viên vì sự cống hiến, cố gắng của mỗi người. Cũng là dịp để mọi người trong một tập thể có cơ hội cùng nhau ngồi nhìn lại những gì mình đã làm được trong năm qua. Những kỷ niệm khó quên, và cùng nhau hợp tác, phát triển trong năm tới. Lễ tổng kết cuối năm là thời gian để mọi người có thể chia sẻ, hòa hợp với nhau, gắn bó với nhau hơn. Giải tỏa những căng thẳng sau một thời gian làm việc vất vả.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;"><img src="https://sfb.vn/wp-content/uploads/2021/01/Anhtet-768x576.jpg" style="display: block; margin-left: auto; margin-right: auto;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong năm vừa qua, mặc dù cho covid ngang nhiên hoành hành nhưng không thể làm ảnh hưởng đến tinh thần làm việc và phát triển của từng cá nhân trong SFB, mọi người cùng chung tay hợp tác hoàn thành tốt các phần việc được giao</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong buổi tất niên, anh Hùng giám đốc công ty đã có đôi lời chia sẻ gửi đến nhân sự: “ Năm 2020 đã qua đi với rất nhiều thay đổi của công ty xét trên mọi phương diện. Với sự đoàn kết, gắn bó, quyết tâm cao, chúng ta đã vượt qua được rất nhiều khó khăn, thách thức để hoàn thành những mục tiêu, nhiệm vụ đặt ra. Chúng ta tự hào về những thành tích mình đạt được và có quyền hy vọng vào một tương lai tươi sáng hơn. Và sang một năm mới, tôi chúc các anh/chị/em CBCNV sẽ cùng nhau hoàn thành tốt mọi việc hơn nữa. Trước thềm năm mới , thay mặt Ban Giám Đốc công ty, tôi trân trọng gửi đến toàn thể các cán bộ, nhân viên trong công ty cùng gia đình lời chúc mừng năm mới: Sức khỏe – Hạnh phúc – An Khang – Thịnh Vượng.”</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;"><img src="https://sfb.vn/wp-content/uploads/2021/01/LuuAnh-768x576.jpg" style="display: block; margin-left: auto; margin-right: auto;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong năm 2020, SFB đã và đang cố gắng thực hiện tốt các mục tiêu trong năm, chạy đua với thời gian là thời khắc tất cả các nhân sự trong SFB cùng nhau nỗ lực, cố gắng và phát triển trên con đường dài phía trước, và cũng là bước đệm cho một năm 2021 thành công. Chúc mừng năm mới!</p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/tatnien-468x312-1768295148167-100918771.png	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		[]	top	t	t	t	f	2021-01-14	2026-01-13 09:05:50.880053	2026-01-13 09:18:29.412996
15	Chúc mừng nhân viên xuất sắc tháng 05/2021	chuc-mung-nhan-vien-xuat-sac-thang-052021	Ngày 20/06 vừa qua, nhân dịp tổng kết hoạt động kinh doanh, Công ty Cổ Phần Công Nghệ SFB đã tiến hành trao thưởng các cá nhân có nhiều đóng góp trong hoạt động của Công ty.	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Ngày 20/06 vừa qua, nhân dịp tổng kết hoạt động kinh doanh, Công ty Cổ Phần Công Nghệ SFB đã tiến hành trao thưởng các cá nhân có nhiều đóng góp trong hoạt động của Công ty.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Ban lãnh đạo đã ký xác nhận và tiến hành trao thưởng danh hiệu Nhân viên xuất sắc tháng 5/2021 cho anh Nguyễn Văn Kha, đồng thời gửi lời cảm ơn tới sự cố gắng của toàn thể cán bộ nhân viên trong thời gian qua.</p><figure class="wp-block-gallery columns-4 is-cropped" style="display: flex; flex-wrap: wrap; list-style-type: none; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"></figure><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;"><img src="https://sfb.vn/wp-content/uploads/2021/06/z2573692357846_b7d751baad19160e317629b2f63e3456-650x1024.jpg" style="display: block; margin-left: auto; margin-right: auto;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><em><span style="font-size: 10pt;">Ban lãnh đạo trao bằng khen cho Anh Nguyễn Văn Kha tại văn phòng công ty SFB.</span></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Một lần nữa, Công ty xin chúc mừng Anh Nguyễn Văn Kha đã đạt danh hiệu Nhân viên xuất sắc tháng 05/2021. Hi vọng những phần thưởng trên sẽ tạo động lực cho cán bộ nhân viên của Công ty để mọi người tiếp tục phát huy các thành tích trong công việc.</p>	Tin công ty	company	published	https://sfb.vn/wp-content/uploads/2021/06/z2573692357846_b7d751baad19160e317629b2f63e3456-650x1024.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		[]	top	t	t	t	f	2021-06-22	2026-01-13 08:56:12.412523	2026-01-13 09:19:29.275076
22	Khai trường văn phòng đơn vị thành viên của SFB	khai-truong-van-phong-don-vi-thanh-vien-cua-sfb	Ngày 26/05/2020 khoso.vn (app giao dịch hộ sim số) văn phòng Hà Nội chính thức khai trương tại địa điểm 110 Cầu Giấy	Đây là một đơn vị thành viên của SFB, điều đáng nói là toàn bộ sản phẩm công nghệ này do SFB độc quyền xây dựng và cung cấp. Với hệ thống mạng lưới văn phòng ở hai đầu Hà Nội và TPHCM khoso.vn đang kỳ vọng bùng nổ trong nửa cuối năm 2020	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/98597006-10222272513223287-1155945445051072512-n-768x512-1768296075107-990503556.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f	Hình ảnh	["https://beta.sfb.vn/uploads/news/100558397-10222272514423317-8098687193440059392-n-641x384-1768296745921-972096619.jpg", "https://beta.sfb.vn/uploads/news/98597006-10222272513223287-1155945445051072512-n-641x384-1768296745944-61466937.jpg", "https://beta.sfb.vn/uploads/news/vk-641x384-1768296746004-426426721.jpg"]	bottom	f	t	t	f	2020-05-26	2026-01-13 09:23:16.584394	2026-01-13 09:48:33.372902
21	Chúc mừng nhân viên xuất sắc tháng 6	chuc-mung-nhan-vien-xuat-sac-thang-6	Nhân lực là chìa khóa dẫn đến thành công của một doanh nghiệp, SFB và toàn thể nhân sự đã và đang đồng hành trên con đường phát triển phía trước.	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Tất cả mọi cố gắng và nhiệt huyết của mọi người đều được toàn thể Lãnh đạo trong công ty ghi nhận.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong tháng 6 SFB đã tuyên dương và khen thưởng đối với nhân sự đã vượt qua những thách thức trong công việc. Luôn sáng tạo và không ngừng phấn đấu để hoàn thành tốt công việc được giao. Ban lãnh đạo đã tuyên dương và khen thưởng đối với:</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Nguyễn Tuấn Anh</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Anh Hùng, Giám đốc công ty chia sẻ: ”SFB đã và đang trải quả “những bước đi chập chững của trẻ lên 3”, với những gian nan, khó khăn và vất vả để hòa nhập dần vào thị trường công nghệ thông tin Việt Nam trên mảng hành chính công. Tôi ghi nhận và chân thành cảm ơn sự cố gắng của toàn bộ anh em công ty. Trong đó, có những anh/em có bước tiến vượt trội về năng lực bản thân, vượt qua được vùng “safe zone” của chính mình! Tôi không tìm thấy lý do gì để không khích lệ thành viên này!”</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;"><br></p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/tu--nnh-768x512-1768295650606-497150084.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		["https://beta.sfb.vn/uploads/news/tu--nnh-768x543-1768298029779-672511435.jpg"]	bottom	f	t	t	f	2020-06-15	2026-01-13 09:16:08.627175	2026-01-13 10:00:08.937705
20	Chúc mừng sinh nhật nhân sự tháng 12	chuc-mung-sinh-nhat-nhan-su-thang-12	Năm 2020 là một năm đầy biến động với mọi người nói chung và đối với SFB nói riêng	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Khi covid 2019 ảnh hưởng đến tất cả mọi hoạt động trong và ngoài nước. Tháng 12 tháng cuối cùng của năm, khi gió lạnh đang dần ùa về giữa lòng hà nội.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Các bạn những chiến binh của SFB vẫn đang cống hiến để mang lại sản phẩm tốt nhất cho khách hàng bằng cả tâm huyết và đam mê của mình. Ghi nhận điều đó, hàng năm SFB đều gửi những lời chúc mừng sinh nhật đến các bạn nhân sự trong ngôi nhà SFB.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Tháng 12 còn đặc biệt hơn nữa khi có đến 5 thành viên cùng có sinh nhật trong tháng. Công ty xin kính chúc các&nbsp;thành viên có ngày sinh trong tháng 12 sẽ luôn phát huy những phẩm chất đáng quý để thành công trong công việc và hạnh phúc trong cuộc sống. Chúc các Anh/&nbsp;Chị sẽ đón một sinh nhật thật ý nghĩa và nhiều niềm vui.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;"><br></p>	Tin công ty	company	published	https://beta.sfb.vn/uploads/news/sfb-sn-768x512-1768295416930-549879349.jpg	SFB Technology	5 phút đọc	from-blue-600 to-cyan-600				f		["https://beta.sfb.vn/uploads/news/sfb-sn-1768298776395-224922415.jpg", "https://beta.sfb.vn/uploads/news/sndattuan-768x576-1768298776414-416154742.jpg"]	bottom	t	t	t	f	2020-12-15	2026-01-13 09:10:41.195168	2026-01-13 10:33:38.486569
\.


--
-- TOC entry 3928 (class 0 OID 20186)
-- Dependencies: 223
-- Data for Name: news_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_categories (code, name, description, parent_code, is_active, created_at, updated_at) FROM stdin;
product	Sản phẩm & giải pháp	Bài viết về sản phẩm/giải pháp	\N	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
company	Tin công ty	Tin tức nội bộ, hoạt động công ty	\N	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
tech	Tin công nghệ	Xu hướng, cập nhật công nghệ	\N	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3925 (class 0 OID 20148)
-- Dependencies: 220
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, code, name, module, description, is_active, created_at, updated_at) FROM stdin;
1	dashboard.view	Xem trang tổng quan	dashboard	Truy cập trang dashboard admin	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	users.view	Xem danh sách người dùng	users	Cho phép xem danh sách tài khoản	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	users.manage	Quản lý người dùng	users	Thêm, sửa, xóa tài khoản	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	roles.view	Xem phân quyền (roles)	roles	Xem danh sách roles	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	roles.manage	Quản lý phân quyền (roles)	roles	Thêm, sửa, xóa roles và gán quyền	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
6	permissions.view	Xem quyền chi tiết	permissions	Xem danh sách permissions	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
7	permissions.manage	Quản lý quyền chi tiết	permissions	Thêm, sửa, xóa permissions	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
8	news.view	Xem danh sách tin tức	news	Xem danh sách bài viết tin tức	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
9	news.manage	Quản lý tin tức	news	Thêm, sửa, xóa bài viết tin tức	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
10	categories.view	Xem danh sách danh mục	categories	Xem các danh mục nội dung	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
11	categories.manage	Quản lý danh mục	categories	Thêm, sửa, xóa danh mục nội dung	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
12	settings.view	Xem cấu hình hệ thống	settings	Truy cập trang cấu hình / cài đặt	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
13	settings.manage	Quản lý cấu hình hệ thống	settings	Thay đổi các cấu hình quản trị	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
14	media.view	Xem thư viện Media	media	Truy cập và xem thư viện media	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
15	media.manage	Quản lý thư viện Media	media	Upload, xóa, quản lý file và thư mục media	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
16	menus.view	Xem danh sách menu	menus	Xem danh sách menu điều hướng	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
17	menus.manage	Quản lý menu	menus	Thêm, sửa, xóa menu điều hướng	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
18	products.view	Xem danh sách sản phẩm	products	Xem danh sách sản phẩm và giải pháp	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
19	products.manage	Quản lý sản phẩm	products	Thêm, sửa, xóa sản phẩm và giải pháp	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
20	product_categories.view	Xem danh mục sản phẩm	products	Xem danh sách danh mục sản phẩm	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
21	product_categories.manage	Quản lý danh mục sản phẩm	products	Thêm, sửa, xóa danh mục sản phẩm	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
22	product_benefits.manage	Quản lý lợi ích sản phẩm	products	Quản lý các lợi ích hiển thị trên trang products	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
23	product_hero.manage	Quản lý Hero Products	products	Quản lý hero section của trang products	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
24	testimonials.manage	Quản lý đánh giá khách hàng	testimonials	Quản lý các đánh giá/testimonials của khách hàng về SFB	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
25	industries.view	Xem danh sách lĩnh vực	industries	Xem danh sách các lĩnh vực hoạt động	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
26	industries.manage	Quản lý lĩnh vực	industries	Thêm, sửa, xóa lĩnh vực hoạt động	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
27	about.manage	Quản lý trang Giới thiệu	about	Quản lý toàn bộ nội dung trang Giới thiệu	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
28	careers.manage	Quản lý trang Tuyển dụng	careers	Quản lý toàn bộ nội dung trang Tuyển dụng	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
29	homepage.manage	Quản lý trang chủ	homepage	Quản lý toàn bộ nội dung các khối trên trang chủ	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
30	contact.view	Xem trang liên hệ	contact	Xem nội dung trang liên hệ	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
31	contact.manage	Quản lý trang liên hệ	contact	Thêm, sửa, xóa nội dung trang liên hệ	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
32	contact_requests.view	Xem yêu cầu tư vấn	contact	Xem danh sách yêu cầu tư vấn	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
33	contact_requests.manage	Quản lý yêu cầu tư vấn	contact	Cập nhật, xóa yêu cầu tư vấn	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
34	seo.view	Xem cấu hình SEO	seo	Xem cấu hình SEO của các trang	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
35	seo.manage	Quản lý SEO	seo	Thêm, sửa, xóa cấu hình SEO	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3938 (class 0 OID 20302)
-- Dependencies: 233
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, slug, name, icon_name, sort_order, is_active, created_at, updated_at) FROM stdin;
1	all	Tất cả sản phẩm	Package	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	edu	Giải pháp Giáo dục	Cloud	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	justice	Công chứng – Pháp lý	Shield	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	gov	Quản lý Nhà nước/Doanh nghiệp	TrendingUp	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	kpi	Quản lý KPI cá nhân	Cpu	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
6	tuvan	Dịch vụ tư vấn 	Package	5	t	2026-01-10 03:30:52.427723	2026-01-10 03:30:52.427723
7	congthongtin	Cổng thông tin điện tử	Package	6	t	2026-01-10 03:37:19.25851	2026-01-10 03:37:19.25851
11	service	Dịch vụ	Globe2	7	t	2026-01-13 02:23:54.1371	2026-01-13 02:23:54.1371
12	manage	Quản lý	Database	8	t	2026-01-13 02:58:04.189479	2026-01-13 02:58:04.189479
13	solution	Giải pháp	Sparkles	9	t	2026-01-13 07:20:05.616146	2026-01-13 07:20:05.616146
14	system	Hệ thống	Network	10	t	2026-01-13 07:49:50.488846	2026-01-13 07:49:50.488846
\.


--
-- TOC entry 3942 (class 0 OID 20349)
-- Dependencies: 237
-- Data for Name: product_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_details (id, product_id, slug, meta_top, hero_description, hero_image, cta_contact_text, cta_contact_href, cta_demo_text, cta_demo_href, overview_kicker, overview_title, showcase_title, showcase_desc, showcase_cta_text, showcase_cta_href, showcase_image_back, showcase_image_front, expand_title, expand_cta_text, expand_cta_href, expand_image, content_mode, content_html, gallery_title, gallery_images, gallery_position, show_table_of_contents, enable_share_buttons, show_author_box, created_at, updated_at) FROM stdin;
5	3	he-thong-csdl-quan-ly-cong-chung-chung-thuc	Giải pháp phần mềm	Hệ thống cơ sở dữ liệu công chứng và chứng thực của Công ty Cổ phần Công nghệ SFB (C3T) sẽ giúp giải quyết triệt để những khó khăn bất cập nêu trên. Hệ thống hỗ trợ người dùng việc tra cứu dữ liệu ngăn chặn và quản lý hợp đồng công chứng phục vụ cho các tổ chức hành nghề công chứng, hỗ trợ người dùng toàn bộ các thao tác từ việc tiếp nhận dữ liệu ngăn chặn, tra cứu dữ liệu ngăn chặn, tra cứu thông tin lịch sử giao dịch tài sản, tiếp nhận thông tin hợp đồng, giao dịch, in ấn các báo cáo thống kê về hợp đồng, giao dịch.	https://beta.sfb.vn/uploads/news/C3T-318x212-1768015188134-257669343.png																	content	<h1 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 26px; line-height: 30px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">GIỚI THIỆU CHUNG</span></h1><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Hoạt động của các tổ chức hành nghề công chứng lâu nay vẫn luôn tiềm ẩn nhiều rủi ro lớn liên quan đến các hợp đồng giao dịch công chứng. Gần đây số lượng phòng công chứng, số lượng giao dịch công chứng gia tăng nhanh càng làm gia tăng nguy cơ tiềm ẩn đó. Hơn nữa nghiệp vụ quản lý tổ chức công chứng ngày càng phức tạp hơn.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Việc tin học hóa hoạt động công chứng, áp dụng CNTT vào công tác công chứng, xây dựng cơ sở dữ liệu ngăn chặn dùng chung từ cấp cơ sở là nhu cầu cấp thiết của tất cả các tổ chức hành nghề công chứng nói chung và các văn phòng công chứng nói riêng.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Hệ thống cơ sở dữ liệu công chứng và chứng thực của&nbsp;<span style="font-weight: 700;">Công ty Cổ phần Công nghệ SFB&nbsp;</span>(C3T) sẽ giúp giải quyết triệt để những khó khăn bất cập nêu trên. Hệ thống hỗ trợ người dùng việc tra cứu dữ liệu ngăn chặn và quản lý hợp đồng công chứng phục vụ cho các tổ chức hành nghề công chứng, hỗ trợ người dùng toàn bộ các thao tác từ việc tiếp nhận dữ liệu ngăn chặn, tra cứu dữ liệu ngăn chặn, tra cứu thông tin lịch sử giao dịch tài sản, tiếp nhận thông tin hợp đồng, giao dịch, in ấn các báo cáo thống kê về hợp đồng, giao dịch.</span></p><h1 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 26px; line-height: 30px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">KHẢ NĂNG TÍCH HỢP HỆ THỐNG</span></h1><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;">Hệ thống có khả năng tích hợp với các phần mềm, cơ sở dữ liệu dùng chung của đơn vị. Ngoài ra, hệ thống đảm bảo được khả sử dụng của lượng user, dữ liệu lớn.</span></p><h1 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 26px; line-height: 30px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">MÔI TRƯỜNG HOẠT ĐỘNG</span></h1><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Mội trường hoạt động trên website, người dùng có thể truy cập hệ thống bằng các thiết bị thông minh có kết nối internet.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Hộ trợ trình duyệt web: Google Chrome, Microsoft Edge, Mozilla Firefox.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Mọi thiết bị như máy tính, laptop, thiết bị di động đều có thể truy cập vào website của hệ thống CSDL Công chứng – Chứng thực C3T</span></p><h1 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 26px; line-height: 30px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">TÓM TẮT CHỨC NĂNG</span></h1><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em><img loading="lazy" class="alignnone wp-image-2948 size-full" src="https://sfb.vn/wp-content/uploads/2023/09/hinh1.png" alt="" width="1634" height="817" srcset="https://sfb.vn/wp-content/uploads/2023/09/hinh1.png 1634w, https://sfb.vn/wp-content/uploads/2023/09/hinh1-300x150.png 300w, https://sfb.vn/wp-content/uploads/2023/09/hinh1-1024x512.png 1024w, https://sfb.vn/wp-content/uploads/2023/09/hinh1-768x384.png 768w, https://sfb.vn/wp-content/uploads/2023/09/hinh1-1536x768.png 1536w" sizes="(max-width: 1634px) 100vw, 1634px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; float: none; height: auto;"></em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em>Hình: Màn hình trang chủ C3T trên môi trường website</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Hệ thống C3T bao gồm các tính năng chính sau:</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><span style="font-weight: 700;">Quản lý hồ sơ công chứng</span></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Cho phép các tổ chức công chứng tiếp nhận; quản lý, lưu trữ; tra cứu thông tin các giao dịch; hợp đồng một cách thống nhất, khoa học. Hệ thống tự động lưu lại thông tin giao dịch của tài sản trong hợp đồng sau mỗi lần giao dịch.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Cập nhật hồ sơ công chứng theo loại: Công chứng hợp đồng, giao dịch; Công chứng bản dịch; Công chứng văn bản, di chúc</span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Nhập thông tin tài sản ngăn chặn</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Quản lý đối tượng ngăn chặn</span></li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em><img loading="lazy" class="aligncenter wp-image-2940 size-full" src="https://sfb.vn/wp-content/uploads/2023/09/Hinh-2.2.png" alt="" width="991" height="537" srcset="https://sfb.vn/wp-content/uploads/2023/09/Hinh-2.2.png 991w, https://sfb.vn/wp-content/uploads/2023/09/Hinh-2.2-300x163.png 300w, https://sfb.vn/wp-content/uploads/2023/09/Hinh-2.2-768x416.png 768w" sizes="(max-width: 991px) 100vw, 991px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto;"></em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em>Hình: Màn hình quản lý hồ sơ công chứng</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><span style="font-weight: 700;">Quản lý hồ sơ chứng thực</span></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Cho phép đơn vị cập nhật, tra cứu thông tin hồ sơ chứng thực</span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Cập nhật hồ sơ chứng thực</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Nhập giấy tờ không hợp lệ</span></li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><span style="font-weight: 700;">Tra cứu</span></span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Tra cứu tài sản</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Tra cứu hồ sơ công chứng</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Tra cứu hồ sơ chứng thực</span></li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em><img loading="lazy" class="aligncenter wp-image-2941 size-full" src="https://sfb.vn/wp-content/uploads/2023/09/Anh-3.png" alt="" width="991" height="528" srcset="https://sfb.vn/wp-content/uploads/2023/09/Anh-3.png 991w, https://sfb.vn/wp-content/uploads/2023/09/Anh-3-300x160.png 300w, https://sfb.vn/wp-content/uploads/2023/09/Anh-3-768x409.png 768w" sizes="(max-width: 991px) 100vw, 991px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto;"></em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em>Hình: Màn hình tra cứu tài sản ngăn chặn và hợp đồng liên quan</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><span style="font-weight: 700;">Tổng hợp – Báo cáo</span></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Công chứng viên; chuyên viên nghiệp vụ có thể tìm kiếm, tra cứu; lập báo cáo về các giao dịch, hợp đồng đã công chứng dễ dàng; nhanh chóng, chuyên nghiệp.</span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Tổng hợp sổ công chứng</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Tổng hợp sổ chứng thực</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Báo cáo công chứng</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Báo cáo chứng thực</span></li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em><img loading="lazy" class="aligncenter wp-image-2942 size-full" src="https://sfb.vn/wp-content/uploads/2023/09/Anh-4.png" alt="" width="991" height="646" srcset="https://sfb.vn/wp-content/uploads/2023/09/Anh-4.png 991w, https://sfb.vn/wp-content/uploads/2023/09/Anh-4-300x196.png 300w, https://sfb.vn/wp-content/uploads/2023/09/Anh-4-768x501.png 768w" sizes="(max-width: 991px) 100vw, 991px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto;">Hình: Màn hình xem trước báo cáo công chứng</em></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><span style="font-weight: 700;">Danh mục</span></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Tạo dựng cơ sở dữ liệu dùng chung; các tổ chức công chứng có thể chia sẻ thông tin hạn chế rủi ro; ngăn chặn các giao dịch giả; tiết kiệm thời gian và chi phí.</span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Danh mục dùng chung</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Danh mục công chứng</span></li><li><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Danh mục chứng thực</span></li></ul><h1 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 26px; line-height: 30px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">CHÍNH SÁCH BẢO TRÌ</span></h1><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">SFB không ngừng cập nhật công nghệ mới, hoàn thiện sản phẩm phù hợp với yêu cầu khách hàng.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Hỗ trợ khách hàng xử lý kịp thời các khúc mắc khi sử dụng phần mềm.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Thực hiện nghiêm túc vấn đề bảo mật thông tin. Không tiết lộ thông tin khách hàng cho bên thứ ba.</span></p><h1 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 26px; line-height: 30px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">LỜI CAM KẾT</span></h1><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Chúng tôi hiểu rằng khách hàng là nhân tố quan trọng nhất trong quyết định sự phát triển của doanh nghiệp. Nhằm đáp ứng nhu cầu của quý khách hàng SFB luôn không ngừng đổi mới, nâng cao chất lượng dịch vụ.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Hỗ trợ training các sản phẩm phần mềm chi tiết, đầy đủ, khoa học giúp quý khách hàng có sử dụng triệt để các chức năng của phần mềm.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Thực hiện đầy đủ các điều khoản hợp đồng thỏa thuận giữa hai bên</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;">Trên đây là một số nét giới thiệu chung về phần mềm quản lý cơ sở dữ liệu công chứng chứng thực. Trong phạm vi tài liệu nhỏ này chúng tôi không thể giới thiệu hết những tính năng ưu việt của Phần mềm này mà nó có thể đáp ứng cho quý vị. Hãy liên hệ với chúng tôi để được tư vấn!</span></p>		[]	top	t	t	t	2026-01-10 03:18:39.28916	2026-01-10 03:22:25.511926
1	1	he-thong-tuyen-sinh-au-cap	TÀI LIỆU GIỚI THIỆU PHẦN MỀM	Phần mềm tuyển sinh đầu cấp là giải pháp giúp nhà trường quản lý tập trung thông tin học sinh và hoạt động lớp học. Phần mềm hỗ trợ các chức năng chính như quản lý hồ sơ học sinh, quản lý nhân sự, quản lý sổ sách, điểm danh và theo dõi đánh giá trẻ. Qua đó, giáo viên dễ dàng cập nhật tình hình học tập, rèn luyện của học sinh, nhà trường nâng cao hiệu quả quản lý, giảm sổ sách thủ công và đảm bảo thông tin chính xác.	/images/product_detail/heroproductdetail.png	LIÊN HỆ NGAY	/contact	DEMO HỆ THỐNG	#demo	SFB - HỒ SƠ HỌC SINH	Tổng quan hệ thống	Trang chủ hệ thống	Trang chủ hệ thống hiển thị trực quan các biểu đồ thống kê theo kết quả học tập của lớp, khối để người dùng theo dõi tiến độ đánh giá, kết quả một cách nhanh và dễ dàng nhất.	Liên hệ với chúng tôi	/contact	/images/product_detail/bieudocot.png	/images/product_detail/bieudotron1.png	Khả năng phát triển mở rộng	Demo hệ thống	#demo	/images/products/tuyen-sinh-dau-cap/expand.png	config			[]	top	t	t	t	2026-01-10 02:59:52.987173	2026-01-10 04:44:26.504616
2	2	bao-gia-san-pham-he-thong-giao-duc-thong-minh	Giải pháp thông minh	Giải pháp giáo của thông minh của SFB tập trung vào các chức năng quản lý của sở, trường, phụ huynh nhằm kết nối một cách dễ dàng các ban ngành giáo dục và phụ huynh học sinh. Dựa trên cơ sở các văn bản, thông tư của Bộ GDĐT, công ty phát triển các chức năng một cách khoa học các chức năng, yêu cầu.	https://beta.sfb.vn/uploads/news/Daiien-512x341-1768013884190-326476321.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-size: 14pt;"><span style="font-weight: 700;"><em>BÁO GIÁ PHẦN MỀM HỆ THỐNG GIÁO DỤC THÔNG MINH</em></span></span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;">Những năm gần đây, công nghệ kỹ thuật được phát triển một cách mạnh mẽ, các ngành, lĩnh vực đã áp dụng CNTT để thực hiện quản lý, sản xuất. Và ngành giáo dục cũng không ngoại lệ. Sự tiến bộ của internet đã mở ra nhiều phương án, cách tiếp cận, quản lý mới cho nhà trường và các ban ngành liên quan. Giáo dục thông minh (Smart Education) là một trong những mô hình được áp dụng rộng rãi trên toàn cả nước ta hiện nay.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;">Hiểu được tầm quan trọng của của CNTT trong quản lý giáo dục, công ty cổ phần công nghệ SFB đã phát triển mô hình các phần mềm phục vụ cho công tác quản lý trường học.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;">Giải pháp giáo của thông minh của SFB tập trung vào các chức năng quản lý của sở, trường, phụ huynh nhằm kết nối một cách dễ dàng các ban ngành giáo dục và phụ huynh học sinh. Dựa trên cơ sở các văn bản, thông tư của Bộ GDĐT, công ty phát triển các chức năng một cách khoa học các chức năng, yêu cầu.</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;"><span style="font-weight: 700;">Hệ thống giáo dục thông minh bao gồm các phần mềm với các chức năng nổi bật sau:</span></span></p><h2><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt;"><span style="font-weight: 700;">Phần mềm sổ liên lạc điện tử:&nbsp;</span>Tiện ích thanh toán học phí, trao đổi giữa phụ huynh, nhà trường, quản lý bài giảng, thời khóa biểu, kết quả học tập của học sinh</span></li></ul></h2><h2><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt;"><span style="font-weight: 700;">Phần mềm hồ sơ học sinh:</span>&nbsp;Quản lý trường học, lớp học, nhân sự, Tổng kết quả học tập theo các thông tư đánh giá, trích xuất báo cáo, hồ sơ cho giáo viên học sinh theo các sổ, biểu tổng hợp đang hiện hành.</span></li></ul></h2><h2><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt;"><span style="font-weight: 700;">Phần mềm quản lý bán trú:&nbsp;</span>Quản lý nhập, xuất kho lương thực, quản lý thực đơn, điểm danh học sinh tham gia ăn bán trú.</span></li></ul></h2><h2><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt;"><span style="font-weight: 700;">Tuyển sinh trực tuyến:&nbsp;</span>Đăng ký tuyển sinh mầm non, lớp 1, lớp 6, đăng ký vào lớp 10. Tra cứu kết quả, quy định tuyển sinh.</span></li></ul></h2><h2><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt;"><span style="font-weight: 700;">Quản lý thư viện:&nbsp;</span>Cho phép quản lý toàn bộ sách, tài liệu trong thư viện. Dễ dàng tra cứu, thống kê mượn trả một cách minh bạch.</span></li></ul></h2><h2></h2><h3></h3><h3><h2><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><li><span style="font-size: 12pt;"><span style="font-weight: 700;">Phần mềm kiểm định chất lượng giáo dục:</span>&nbsp;Tin học hoá quá trình kiểm định chất lượng giáo dục. Lưu trữ kết quả, quá trình kiểm định.</span></li></ul></h2></h3><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: justify;"><span style="font-size: 12pt;">Dưới đây là bảng báo giá các phần&nbsp;mềm trong mô hình giáo dục thông minh mà công ty đã và đang triển khai</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-size: 12pt;"><a href="https://sfb.vn/wp-content/uploads/2023/12/BAO-GIA-PHAN-MEM-SFB.pdf" style="text-decoration: underline; color: rgb(255, 181, 54);">BÁO GIÁ PHẦN MỀM SFB</a></span></p>		[]	top	t	t	t	2026-01-10 02:59:55.142616	2026-01-12 03:58:19.843195
4	8	he-thong-quan-ly-tai-lieu-luu-tru	Giải pháp phần mềm	Phần mềm quản lý tài liệu lưu trữ được sử dụng trong công tác quản lý văn bản hay hồ sơ, giấy tờ, các tài liệu thông tin của các cơ quan và doanh nghiệp, giúp giảm thiểu công tác lưu trữ giấy tờ như trước kia và bảo đảm tính bảo mật, an toàn về thông tin với các dữ liệu quan trọng.	https://beta.sfb.vn/uploads/news/HA1-1768183785017-569490784.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Phần mềm quản lý tài liệu lưu trữ được sử dụng trong công tác quản lý văn bản hay hồ sơ, giấy tờ, các tài liệu thông tin của các cơ quan và doanh nghiệp, giúp giảm thiểu công tác lưu trữ giấy tờ như trước kia và bảo đảm tính bảo mật, an toàn về thông tin với các dữ liệu quan trọng.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Công nghệ triển khai:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Nền tảng: asp.net 4.0</li><li>Hệ điều hành: Window Server 2008 trở lên</li><li>Hệ quản trị hệ CSDL: SQL Server 2008 hoặc cao hơn hoặc Oracle Database Server 11g hoặc cao hơn.</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Tính năng nổi bật:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li><span style="font-weight: 700;">Phân hệ thu thập tài liệu:</span>&nbsp;Cho phép quản lý các kế hoạch thu thập tài liệu định kỳ của đơn vị; Cho phép các đơn vị đơn vị tham gia hệ thống thực hiện biên mục tài liệu nộp lưu; Xây dựng các mẫu biên bản nộp lưu tài liệu và gửi về cho đơn vị tiếp nhận; Hệ thống cho phép người dùng xây dựng động các mẫu biên bản bàn giao; Các báo cáo – thống kê về tình hình thu thập tài liệu tại các đơn vị nộp lưu.</li><li><span style="font-weight: 700;">Phân hệ biên mục chỉnh lý:</span>&nbsp;Cung cấp các chức năng cho phép người dùng tiếp nhận các biên bản nộp lưu tài liệu từ các đơn vị nộp lưu; Thực hiện biên mục chỉnh lý sơ lược tài liệu; Quản lý kho tài liệu lưu trữ bao gồm: loại hình tài liệu, mục lục lưu trữ tài liệu, hồ sơ và văn bản lưu trữ; Sắp xếp tài liệu lưu trữ vào hộp cặp; Xây dựng các kế hoạch kiểm kê, kế hoạch hủy tài liệu; Thực hiện kiểm kê tài liệu và hủy tài liệu lưu trữ trong hệ thống; Các báo cáo thống kê về tình hình lưu trữ tài liệu bao gồm: In bìa hồ sơ; báo cáo tài liệu theo mục lục tài liệu, hộp cặp, kho lưu trữ, tầng lưu trữ, giá lưu trữ,…</li><li><span style="font-weight: 700;">Phân hệ lưu thông tài liệu:</span>&nbsp;Cho phép quản lý tài khoản các cán bộ khai thác dữ liệu; Phân quyền cán bộ khai thác theo nhóm người dùng khai thác, cấp độ mật tài liệu, theo đơn vị,… Quản lý các yêu cầu mượn tài liệu (bản cứng) trên hệ thống; Các báo cáo thống kê về tình hình khai thác tài liệu bao gồm: báo cáo mượn, trả tài liệu, thống kê tài liệu xem nhiều nhất; tải nhiều nhất;…</li><li><span style="font-weight: 700;">Phân hệ khai thác trực tuyến:</span>&nbsp;Cho phép cán bộ khai thác thực hiện tra cứu tài liệu lưu trữ trong kho lưu trữ. Hệ thống cung cấp cán bộ khai thác thông tin tìm kiếm nhanh; tìm kiếm đơn giản, tìm kiếm nâng cao, tìm kiếm toàn văn thông tin biên mục tài liệu, thông tin tài liệu điện tử đính kèm. Cán bộ khai thác có thể xem thông tin chi tiết tài liệu hoặc thông tin từ điển đảo của tài liệu.</li><li><span style="font-weight: 700;">Phân hệ danh mục:</span>&nbsp;Quản lý thông tin danh mục dùng chung trong hệ thống, bao gồm: Đơn vị; Phòng ban; Khung tin; Trường nhập tin; Cấp độ mật tài liệu; Kho lưu trữ; Tầng lưu trữ; Giá lưu trữ; Hộp cặp; Loại hình tài liệu; Phông lưu trữ;…</li><li><span style="font-weight: 700;">Phân hệ quản trị hệ thống:</span>&nbsp;Cho phép quản lý phân quyền người dùng theo nhóm người dùng; Thiết lập các tham số hệ thống; Theo dõi và trích xuất dữ liệu nhật ký hệ thống.</li></ul>		[]	top	t	t	t	2026-01-10 03:17:47.888049	2026-01-13 02:32:48.952375
3	7	phan-mem-quan-ly-thi-ua-khen-thuong	Giải pháp phần mềm	Phần mềm quản lý thi đua khen thưởng là công cụ hữu ích giúp các doanh nghiệp, công ty theo dõi được quá trình khen thưởng cá nhân, nhóm, tập thể tránh việc bỏ sót những cá nhân, tập thể xuất sắc.	https://beta.sfb.vn/uploads/news/HA2-1768183892712-915751854.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Phần mềm quản lý thi đua khen thưởng là công cụ hữu ích giúp các doanh nghiệp, công ty theo dõi được quá trình khen thưởng cá nhân, nhóm, tập thể tránh việc bỏ sót những cá nhân, tập thể xuất sắc.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Một trong những công cụ hữu ích ở trong công ty, doanh nghiệp là phần mềm quản lý thi đua khen thưởng. Đối với các công ty, doanh nghiệp tổ chức khen thưởng thì phần mềm quản lý này sẽ hỗ trợ các công việc trong quản lý khen thưởng, giảm đi gánh nặng, áp lực công việc trong công tác quản lý hành chính và giúp người dùng yên tâm.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Công nghệ triển khai:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Nền tảng: asp.net 4.0</li><li>Hệ điều hành: Window Server 2008 trở lên</li><li>Hệ quản trị hệ CSDL: SQL Server 2008 hoặc cao hơn</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Tính năng nổi bật:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Quản lý dữ liệu đảng viên</li><li>Quản lý thi đua khen thưởng kỷ luật</li><li>Tra cứu và khai thác dữ liệu</li><li>Cảnh báo dữ liệu</li><li>Danh mục hệ thống</li><li>Quản trị hệ thống</li></ul>		[]	top	t	t	t	2026-01-10 03:04:35.052745	2026-01-13 02:33:01.066326
6	10	dich-vu-quan-tri-va-van-hanh-he-thong	Quản trị và vận hành hệ thống	SFB hiểu được những lo âu của doanh nghiệp khi vận hành hệ thống. Liệu hệ thống có đang vận hành tối ưu? Các bản có được cập nhật đầy đủ?… SFB đem lại giải pháp quản trị và vận hành hệ thống cho doanh nghiệp với những lợi ích	https://beta.sfb.vn/uploads/news/QTHT-350x233-1768015598477-69430200.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">SFB hiểu được những lo âu của doanh nghiệp khi vận hành hệ thống. Liệu hệ thống có đang vận hành tối ưu? Các bản có được cập nhật đầy đủ?… SFB đem lại giải pháp quản trị và vận hành hệ thống cho doanh nghiệp với những lợi ích:</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Giảm chi phí quản lý hệ thống IT</li><li>Chi phí đầu tư cố định</li><li>Khả năng mở rộng và linh hoạt dịch vụ</li><li>Chủ động trong việc giám sát và theo dõi hệ thống</li><li>Cơ sở hạ tầng CNTT được kiểm tra và đánh giá liên tục</li><li>Nhân sự chuyên nghiệp, chất lượng và chuyên sâu</li><li>Nhân viên hỗ trợ 24/7</li><li>Quản lý chuyên nghiệp</li><li>Giúp doanh nghiệp tập trung hoat động kinh doanh</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Với những chuyên viên quản trị luôn túc trực và giám sát chặt chẽ hệ thống bạn có thể yên tâm tập trung vào khai thác các dịch vụ doanh nghiệp mà không phải lo nghĩ về hệ thống, hạ tầng.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class="aligncenter wp-image-2368 size-full" src="https://sfb.vn/wp-content/uploads/2020/06/QTHT.png" alt="" width="350" height="409" srcset="https://sfb.vn/wp-content/uploads/2020/06/QTHT.png 350w, https://sfb.vn/wp-content/uploads/2020/06/QTHT-257x300.png 257w" sizes="(max-width: 350px) 100vw, 350px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 33.5994%; max-width: 100%;"></p>		[]	top	f	t	t	2026-01-10 03:26:45.66408	2026-01-13 02:32:35.120331
7	9	he-thong-quan-ly-thu-vien-so	Hệ thống truy hồi thông tin	Thư viện số hay thư viện trực tuyến là thư viện mà ở đó các bộ sưu tập các văn bản, tài liệu hình ảnh, tài liệu âm thanh, tài liệu video được lưu trữ dưới dạng số (tương phản với các định dạng in, vi dạng, hoặc các phương tiện khác) cùng với các phương tiện để tổ chức, lưu trữ và truy cập các tài liệu dưới dạng tập tin trong bộ sưu tập của thư viện. Thư viện kỹ thuật số có thể khác nhau rất nhiều về kích thước và phạm vi, và có thể được duy trì bởi các cá nhân, tổ chức hoặc là một phần được mới thành lập từ các thư viện thông thường hoặc các viện, hoặc với các tổ chức học thuật. Các nội dung kỹ thuật số có thể được lưu trữ cục bộ, hoặc truy cập từ xa thông qua mạng máy tính. Một thư viện điện tử là một loại hệ thống thông tin. Thư viện số là một loại hệ thống truy hồi thông tin.	https://beta.sfb.vn/uploads/news/h--nh----nh-b--a-5-768x512-1768016871648-661418995.jpg																	content	<span style="color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Thư viện số hay thư viện trực tuyến là thư viện&nbsp;mà ở đó các bộ sưu tập các văn bản, tài liệu hình ảnh, tài liệu âm thanh, tài liệu video được lưu trữ dưới dạng số (tương phản với các định dạng in, vi dạng, hoặc các phương tiện khác) cùng với các phương tiện để tổ chức, lưu trữ và truy cập các tài liệu dưới dạng tập tin trong bộ sưu tập của thư viện. Thư viện kỹ thuật số có thể khác nhau rất nhiều về kích thước và phạm vi, và có thể được duy trì bởi các cá nhân, tổ chức hoặc là một phần được mới thành lập từ các thư viện thông thường hoặc các viện, hoặc với các tổ chức học thuật. Các nội dung kỹ thuật số có thể được lưu trữ cục bộ, hoặc truy cập từ xa thông qua mạng máy tính. Một thư viện điện tử là một loại hệ thống thông tin. Thư viện số là một loại hệ thống truy hồi thông tin.</span><div style="text-align: center; width: 100%; margin-bottom: 1rem;"><img src="https://beta.sfb.vn/uploads/news/ha1-1768015650649-181859345.jpg" alt="Gallery 1" style="display: block; margin-left: auto; margin-right: auto;"><div><p style="text-align: left; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Mục tiêu của sản phẩm</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li style="text-align: left;">Thực hiện điện tử hóa quy trình quản lý tài liệu điện tử số hóa</li><li style="text-align: left;">Tổ chức và tích hợp với hệ thống nghiệp vụ khác (nếu có)</li><li style="text-align: left;">Bảo mật an toàn thông tin</li><li style="text-align: left;">Khai thác tra cứu dữ liệu nhanh chóng, chính xác</li><li style="text-align: left;">Phục vụ báo cáo một cách linh hoạt về tình hình quản lý tài liệu số trong hệ thống.</li></ul><p style="text-align: left; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Tính năng nổi bật:</em></p><p style="text-align: center; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; width: 100%;"><img src="https://beta.sfb.vn/uploads/news/HA2-1768015734157-33064391.jpg" alt="Gallery 2" style="display: block; margin-left: auto; margin-right: auto;"></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li style="text-align: left;"><span style="font-weight: 700;">Phân hệ quản lý tài nguyên số:</span>&nbsp;Cho phép quản lý thông tin danh sách tài liệu số trong hệ thống; người dùng có thể chủ động thiết lập hoặc xây dựng các khung nhập tin tùy theo nhiều loại hình tài liệu khác nhau; Quản lý các chuyên đề tài liệu số; Các bộ tập tài liệu; Lịch sử giao dịch của tài liệu; thông tin đánh giá, quan tâm về tài liệu số; Các báo cáo thống kê tình hình biến động và giao dịch của tài liệu số.</li><li style="text-align: left;"><span style="font-weight: 700;">Phân hệ quản lý cán bộ khai thác:</span>&nbsp;Cho phép quản lý thông tin cán bộ khai thác; thông tin đăng ký trực tuyến; thông tin tài khoản; lịch sử giao dịch, danh sách tài liệu quan tâm; các báo cáo thống kê về cán bộ khai thác.</li><li style="text-align: left;"><span style="font-weight: 700;">Phân hệ lưu thông:</span>&nbsp;Cho phép quản lý và xây dựng các chính sách lưu thông tài liệu (khuyến mãi; giảm giá;…); Xử lý (phê duyệt; từ chối; phản hồi) yêu cầu mua hoặc sử dụng tài liệu của cán bộ khai thác; Báo cáo – thống kê về tình hình khai thác của tài liệu và cán bộ khai thác.</li><li style="text-align: left;"><span style="font-weight: 700;">Phân hệ khai thác trực tuyến:</span>&nbsp;Cho phép cán bộ khai thác thực hiện tra cứu và khai thác tài liệu. Thông qua các chức năng tìm kiếm đơn giản, nâng cao, tìm kiếm toàn văn thông tin biên mục hoặc các tệp tin số hóa trên hệ thống, cán bộ khai thác có thể xem thông tin chi tiết biên mục của tài liệu, xem giới thiệu (trailer) hoặc toàn bộ trực tiếp các tệp tin số hóa.</li><li style="text-align: left;"><span style="font-weight: 700;">Phân hệ danh mục:</span>&nbsp;Quản lý thông tin danh mục dùng chung trong hệ thống, bao gồm: Đơn vị; Phòng ban; Khung tin; Trường nhập tin; Cấp độ mật tài liệu;…</li><li style="text-align: left;"><span style="font-weight: 700;">Phân hệ quản trị hệ thống:</span>&nbsp;Cho phép quản lý phân quyền người dùng theo nhóm người dùng; Thiết lập các tham số hệ thống; Theo dõi và trích xuất dữ liệu nhật ký hệ thống; Quản lý các dữ liệu đã xóa (phục hồi hoặc xóa vĩnh viễn dữ liệu)</li></ul><p style="text-align: left; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Công nghệ phát triển:</em></p><p style="text-align: center; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; width: 100%;"><img src="https://beta.sfb.vn/uploads/news/HA3-1768015758139-276386425.jpg" alt="Gallery 3" style="display: block; margin-left: auto; margin-right: auto;"></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li style="text-align: left;">Nền tảng: asp.net 4.0</li><li style="text-align: left;">Hệ điều hành: Window Server 2008 trở lên</li><li style="text-align: left;">Hệ quản trị hệ CSDL: SQL Server 2008 hoặc cao hơn</li></ul><p style="text-align: left; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Các phân hệ</em></p><p style="text-align: left; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em><br></em></p><p style="text-align: center; margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; width: 100%;"><img src="https://beta.sfb.vn/uploads/news/ha4-1768015784831-673324571.jpg" alt="Gallery 4" style="display: block; margin-left: auto; margin-right: auto;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em><br></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em><br></em></p><div><font color="#333333" face="Roboto, Helvetica, Arial, Verdana, sans-serif"><span style="font-size: 15px;"><br></span></font><div><span style="color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><br></span></div></div></div></div>		[]	top	t	t	t	2026-01-10 03:27:18.080082	2026-01-13 02:32:43.048626
8	11	dich-vu-tu-van-xay-dung-va-phat-trien-he-thong	Tư vấn xây dựng và phát triển hệ thống	SFB hiện diện để tư vấn xây dựng và phát triển hệ thống hiểu được rõ yêu cầu của khách hàng. Từ đó, việc vận hành xây dựng hệ thống sẽ sát với nhu cầu người dùng. SFB lập kế hoạch và phát triển hệ thống nhằm nâng cao năng suất công việc, giảm chi phí và tăng doanh thu,… Song song với việc tư vấn, đội ngũ lập trình viên rất am tường của chúng tôi sẽ thiết kế và phát triển hệ thống phù hợp với nhu cầu cuả khách hàng.	https://beta.sfb.vn/uploads/news/cnm-1768015992342-131361929.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong thời đại 4.0, hầu hết các doanh nghiệp đều nhận thức được việc sử dụng CNTT vào một trong những chiếc lược kinh doanh giúp gia tăng hiệu quả kinh doanh, tăng khả năng cạnh canh trên thị trường.<br>SFB hiện diện để tư vấn xây dựng và phát triển hệ thống hiểu được rõ yêu cầu của khách hàng. Từ đó, việc vận hành xây dựng hệ thống sẽ sát với nhu cầu người dùng. SFB lập kế hoạch và phát triển hệ thống nhằm nâng cao năng suất công việc, giảm chi phí và tăng doanh thu,… Song song với việc tư vấn, đội ngũ lập trình viên rất am tường của chúng tôi sẽ thiết kế và phát triển hệ thống phù hợp với nhu cầu cuả khách hàng.<br>Hãy liên lạc với chúng tôi để được tư vấn xây dựng và phát triển hệ thống đáp ứng mong muốn cho doanh nghiệp của bạn !</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><br></p>		[]	top	f	t	f	2026-01-10 03:33:14.612124	2026-01-13 02:30:53.855697
10	13	xay-dung-cong-thong-tin-ien-tu-cho-so-ngoai-vu-tinh-thai-binh	GIẢI PHÁP PHẦN MỀM 	Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng. Dưới đây chúng tôi xin nêu ra những lợi ích mà website sẽ mang đến cho các cơ quan	https://beta.sfb.vn/uploads/news/cong-thong-tin-1768209549349-131546639.webp																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng. Dưới đây chúng tôi xin nêu ra những lợi ích mà website sẽ mang đến cho các cơ quan.</p><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">1. Khối lượng thông tin cung cấp không hạn chế như trên báo đài</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Lượng thông tin bạn đưa lên web tùy thuộc vào ý muốn và nhu cầu của bạn. Việc không giới hạn khối lượng thông tin giúp mọi người dùng có thể truy cập thông tin, tin tức một cách nhanh chóng</p><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">2. Công bố thông tin trên diện rộng</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Internet là để kết nối hơn 7 tỷ người lại với nhau, không chỉ gói gọn trong phạm vi lãnh thổ quốc qua. Mọi người dân Việt Nam sinh sống tại nước ngoài đều theo dõi được thông tin, tin tức quê hương của mình. Nhờ sự phát triển vượt bậc của công nghệ, việc đưa thông tin đến với từng cá nhân không quá khó khăn.</p><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">3. Dễ dàng tìm kiếm bất cứ lúc nào, bất cứ đâu</h2><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Như trước kia và hiện tại như ngày nay cơ quan thông báo mọi thông tin trên loa, đài phát thanh. Tuy nhiên không phải ai cũng có thể nghe trong cùng lúc đó vì vậy mới thấy được lợi ích mà website mang lại. Dù ở bất cứ đâu, bất cứ lúc nào đều có thể truy cập website để nắm bắt thông tin, tin tức một cách nhanh chóng nhất vì website hoạt động 24/24.</h2><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">4. Tương tác giữa cơ quan và mọi người</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Mọi người dân đều có thể đặt câu hỏi tại phần trao đổi. Không cần mất công đi lại, mất thời gian mọi người dùng đều có thể biết được câu trả lời của mình.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Bấm vào ảnh hoặc link dẫn để xem chi tiết:&nbsp;<a href="http://songoaivu.thaibinh.gov.vn/" style="text-decoration: underline; color: rgb(255, 181, 54);">http://songoaivu.thaibinh.gov.vn/</a></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><a href="http://songoaivu.thaibinh.gov.vn/" style="text-decoration: none; color: rgb(255, 181, 54); outline: 0px;"><img loading="lazy" class="aligncenter wp-image-2330 size-full" src="https://sfb.vn/wp-content/uploads/2020/06/songoaivu.thaibinh.gov_.vn_-1.png" alt="" width="1349" height="4329" srcset="https://sfb.vn/wp-content/uploads/2020/06/songoaivu.thaibinh.gov_.vn_-1.png 1349w, https://sfb.vn/wp-content/uploads/2020/06/songoaivu.thaibinh.gov_.vn_-1-319x1024.png 319w, https://sfb.vn/wp-content/uploads/2020/06/songoaivu.thaibinh.gov_.vn_-1-768x2465.png 768w, https://sfb.vn/wp-content/uploads/2020/06/songoaivu.thaibinh.gov_.vn_-1-479x1536.png 479w, https://sfb.vn/wp-content/uploads/2020/06/songoaivu.thaibinh.gov_.vn_-1-638x2048.png 638w" sizes="(max-width: 1349px) 100vw, 1349px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 61.467%; max-width: 100%;"></a></p>		[]	top	t	t	t	2026-01-12 09:01:51.357063	2026-01-12 09:19:32.956049
13	16	dich-vu-outsourcing	GIẢI PHÁP PHẦN MỀM	Outsourcing là một xu hướng nhân lực thế kỷ 21. Dịch vụ outsourcing đang ngày một phát triển và chiếm ưu thế với sự xuất hiện của nhiều doanh nghiệp. Là hình thức chuyển một phần chức năng nhiệm vụ của công ty ra công ty khác, những chức năng mà trước đây doanh nghiệp vẫn đảm nhận.	https://beta.sfb.vn/uploads/news/OURR-600x400-1768271342383-977391461.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Outsourcing là một xu hướng nhân lực thế kỷ 21. Dịch vụ outsourcing đang ngày một phát triển và chiếm ưu thế với sự xuất hiện của nhiều doanh nghiệp. Là hình thức chuyển một phần chức năng nhiệm vụ của công ty ra công ty khác, những chức năng mà trước đây doanh nghiệp vẫn đảm nhận.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Khi đến với SFB bạn sẽ thấy:</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">Dịch vụ chuyên nghiệp</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Chúng tôi cung cấp dịch vụ outsourcing phát triển phần mềm, cho các công ty lớn nhỏ. Đồng thời hỗ trợ thúc đẩy các nghiệp vụ mang lại lợi ích giúp doanh nghiệp thành công.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hỗ trợ đối tác công nghệ tiên tiến nhất trong quá trình đảm nhiệm. Giảm chi phí quản lý cơ sở hạ tầng CNTT thông qua việc cải thiện năng suất và hiệu quả hoạt động.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hỗ trợ xuyên suốt vòng đời dự án, theo sát tiến trình công việc.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">Đội ngũ lập trình viên</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Công ty chúng tôi có các lập trình viên đáp ứng nhiều yêu cầu từ developer, leader giúp khách hàng phát triển dự án ứng dụng bất kỳ từ đơn giản đến phức tạp. Các lập trình viên có nền tảng và kỷ năng chuyên sâu. Chúng tôi sẵn sàng đáp ứng các yêu cầu khắt khe nhất về tiêu chuẩn sáng tạo cũng như về nguồn nhân lực. Với các dự án đặt biệt lớn, chúng tôi sẽ bố trí đội ngũ tư vấn giải pháp và thiết kế cũng như giải pháp bảo mật hệ thống.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">Đôi tác phát triển gia công phần mềm đáng tin cậy của bạn</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Với chuyên môn và cam kết hoàn thành tốt vai trò của mình, SFB mang lại dịch vụ CNTT chuyên nghiệp, hiệu quả. Chúng tôi đã hợp tác với nhiều công ty khác nhau và đều đem lại phản hồi tích cực bởi thái độ làm việc chuyên nghiệp, trình đồ nhân sự có chuyên môn.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class="aligncenter wp-image-2383 size-full" src="https://sfb.vn/wp-content/uploads/2020/06/OURT.jpg" alt="" width="427" height="281" srcset="https://sfb.vn/wp-content/uploads/2020/06/OURT.jpg 427w, https://sfb.vn/wp-content/uploads/2020/06/OURT-300x197.jpg 300w" sizes="(max-width: 427px) 100vw, 427px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 72.9046%; max-width: 100%;"></p>		[]	top	f	t	t	2026-01-13 02:29:50.582218	2026-01-13 02:29:52.524619
12	15	xay-dung-cong-thong-tin-ien-tu-cho-so-noi-vu-tinh-thai-binh	GIẢI PHÁP PHẦN MỀM 	Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng	https://beta.sfb.vn/uploads/news/snvtb-290x193-1768270672229-696489847.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng. Dưới đây chúng tôi xin nêu ra những lợi ích mà website sẽ mang đến cho các cơ quan.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">1. Khối lượng thông tin cung cấp không hạn chế như quảng cáo trên báo đài</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Lượng thông tin bạn đưa lên web tùy thuộc vào ý muốn và nhu cầu của bạn. Việc không giới hạn khối lượng thông tin giúp mọi người dùng có thể truy cập thông tin, tin tức một cách nhanh chóng</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">2. Công bố thông tin trên diện rộng</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Internet là để kết nối hơn 7 tỷ người lại với nhau, không chỉ gói gọn trong phạm vi lãnh thổ quốc qua. Mọi người dân Việt Nam sinh sống tại nước ngoài đều theo dõi được thông tin, tin tức quê hương của mình. Nhờ sự phát triển vượt bậc của công nghệ, việc đưa thông tin đến với từng cá nhân không quá khó khăn.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">3. Dễ dàng tìm kiếm bất cứ lúc nào, bất cứ đâu</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Như trước kia và hiện tại như ngày nay cơ quan thông báo mọi thông tin trên loa, đài phát thanh. Tuy nhiên không phải ai cũng có thể nghe trong cùng lúc đó vì vậy mới thấy được lợi ích mà website mang lại. Dù ở bất cứ đâu, bất cứ lúc nào đều có thể truy cập website để nắm bắt thông tin, tin tức một cách nhanh chóng nhất vì website hoạt động 24/24.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">4. Tương tác giữa cơ quan và mọi người</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Mọi người dân đều có thể đặt câu hỏi tại phần trao đổi. Không cần mất công đi lại, mất thời gian mọi người dùng đều có thể biết được câu trả lời của mình.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Bấm vào ảnh hoặc link dẫn để xem:&nbsp;<a href="http://bantdkt.thaibinh.gov.vn/" style="text-decoration: underline; color: rgb(255, 181, 54);">http://bantdkt.thaibinh.gov.vn/</a></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><a href="http://bantdkt.thaibinh.gov.vn/" style="text-decoration: underline; color: rgb(255, 181, 54);"><img loading="lazy" class="aligncenter wp-image-2315 size-full" src="https://sfb.vn/wp-content/uploads/2020/06/tbsnv.png" alt="" width="1349" height="2519" srcset="https://sfb.vn/wp-content/uploads/2020/06/tbsnv.png 1349w, https://sfb.vn/wp-content/uploads/2020/06/tbsnv-161x300.png 161w, https://sfb.vn/wp-content/uploads/2020/06/tbsnv-548x1024.png 548w, https://sfb.vn/wp-content/uploads/2020/06/tbsnv-768x1434.png 768w, https://sfb.vn/wp-content/uploads/2020/06/tbsnv-823x1536.png 823w, https://sfb.vn/wp-content/uploads/2020/06/tbsnv-1097x2048.png 1097w" sizes="(max-width: 1349px) 100vw, 1349px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 75.289%; max-width: 100%;"></a></p>		[]	top	f	t	t	2026-01-13 02:17:55.215144	2026-01-13 02:30:20.73681
11	14	xay-dung-cong-thong-tin-ien-tu-cho-ang-uy-khoi-doanh-nghiep-tinh-thai-binh	GIẢI PHÁP PHẦN MỀM	Là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng.	https://beta.sfb.vn/uploads/news/dutb-368x245-1768269965426-368992113.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng. Dưới đây chúng tôi xin nêu ra những lợi ích mà website sẽ mang đến cho các cơ quan.</p><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">1. Khối lượng thông tin cung cấp không hạn chế như quảng cáo trên báo đài</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Lượng thông tin bạn đưa lên web tùy thuộc vào ý muốn và nhu cầu của bạn. Việc không giới hạn khối lượng thông tin giúp mọi người dùng có thể truy cập thông tin, tin tức một cách nhanh chóng</p><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">2. Công bố thông tin trên diện rộng</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Internet là để kết nối hơn 7 tỷ người lại với nhau, không chỉ gói gọn trong phạm vi lãnh thổ quốc qua. Mọi người dân Việt Nam sinh sống tại nước ngoài đều theo dõi được thông tin, tin tức quê hương của mình. Nhờ sự phát triển vượt bậc của công nghệ, việc đưa thông tin đến với từng cá nhân không quá khó khăn.</p><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">3. Dễ dàng tìm kiếm bất cứ lúc nào, bất cứ đâu</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Như trước kia và hiện tại như ngày nay cơ quan thông báo mọi thông tin trên loa, đài phát thanh. Tuy nhiên không phải ai cũng có thể nghe trong cùng lúc đó vì vậy mới thấy được lợi ích mà website mang lại. Dù ở bất cứ đâu, bất cứ lúc nào đều có thể truy cập website để nắm bắt thông tin, tin tức một cách nhanh chóng nhất vì website hoạt động 24/24.</p><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">4. Tương tác giữa cơ quan và mọi người</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Mọi người dân đều có thể đặt câu hỏi tại phần trao đổi. Không cần mất công đi lại, mất thời gian mọi người dùng đều có thể biết được câu trả lời của mình.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Bấm vào ảnh hoặc link dẫn để xem chi tiết:&nbsp;<a href="http://dukdnthaibinh.vn/" style="text-decoration: underline; color: rgb(255, 181, 54);">//dukdnthaibinh.vn/</a></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><a href="http://dukdnthaibinh.vn/" style="text-decoration: underline; color: rgb(255, 181, 54);"><img loading="lazy" class="aligncenter wp-image-2325 size-full" src="https://sfb.vn/wp-content/uploads/2020/06/duktb.png" alt="" width="1349" height="2568" srcset="https://sfb.vn/wp-content/uploads/2020/06/duktb.png 1349w, https://sfb.vn/wp-content/uploads/2020/06/duktb-158x300.png 158w, https://sfb.vn/wp-content/uploads/2020/06/duktb-538x1024.png 538w, https://sfb.vn/wp-content/uploads/2020/06/duktb-768x1462.png 768w, https://sfb.vn/wp-content/uploads/2020/06/duktb-807x1536.png 807w, https://sfb.vn/wp-content/uploads/2020/06/duktb-1076x2048.png 1076w" sizes="(max-width: 1349px) 100vw, 1349px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 72.6156%; max-width: 100%;"></a></p>		[]	top	f	t	t	2026-01-13 02:05:28.136811	2026-01-13 02:30:26.944737
9	12	trang-thuong-mai-ien-su-san-pham-ngoc-linh	Giải pháp phần mềm	Ngày nay công nghệ đang ngày một phát triển, vì vậy việc quản lý mọi thông tin khách hàng cũng như sản phẩm kinh doanh trên nền công nghệ thông tin là rất hữu dụng. Hiểu được điều đó Công ty Cổ phần Công nghệ SFB đã cùng với quý khách hàng phát triển website Sản phẩm Ngọc Linh. Với mục đích đưa website Sản phẩm Ngọc Linh vào sử dụng sẽ giúp khách hàng 	https://beta.sfb.vn/uploads/news/ngoc-linh-768x648-1768017041371-869639814.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Ngày nay công nghệ đang ngày một phát triển, vì vậy việc quản lý mọi thông tin khách hàng cũng như sản phẩm kinh doanh trên nền công nghệ thông tin là rất hữu dụng. Hiểu được điều đó Công ty Cổ phần Công nghệ SFB đã cùng với quý khách hàng phát triển website&nbsp;<span style="font-weight: 700;">Sản phẩm Ngọc Linh</span>. Với mục đích đưa website Sản phẩm Ngọc Linh vào sử dụng sẽ giúp khách hàng :</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Xây dựng và quảng bá thương hiệu</li><li>Người sử dụng tiếp cận được nhiều khách hàng tiềm năng</li><li>Hỗ trợ khách hàng 24/24</li><li>Tăng hiệu quả kinh doanh</li><li>Tăng năng lực cạnh tranh</li><li>Tăng lợi nhuận</li><li>Cập nhật thông tin sản phẩm một cách nhanh chóng</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Nhờ đó mà sản phẩm của bạn sẽ ngày càng được biết đến trên diện rộng và chắn chắn rằng doanh nghiệp của bạn sẽ ngày một phát triển hơn.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;"><img src="https://sfb.vn/wp-content/uploads/2020/06/wsnl-598x1024.png" style="display: block; margin-left: auto; margin-right: auto;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center; width: 100%;">&nbsp;</p>		[]	top	t	t	t	2026-01-10 03:46:27.995841	2026-01-13 02:30:40.354285
15	5	he-thong-thong-tin-quan-ly-giam-sat-doanh-nghiep	GIẢI PHÁP PHẦN MỀM	Trong thời đại công nghệ phát triển, việc ứng dụng phần mềm vào các quy trình nghiệp vụ của một cơ quan là vô cùng thiết yếu. Hệ thống thông tin quản lý giám sát Nhà nước tại doanh nghiệp  có những tính năng vô cùng chi tiết, ưu việt đáp ứng các yêu cầu đề bài đặt ra từ Cục Tài chính doanh nghiệp	https://beta.sfb.vn/uploads/news/btc-255x170-1768272223960-150706494.png																	content	<h2 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 22px; line-height: 26px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">1. Giới thiệu chung</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong thời đại công nghệ phát triển, việc ứng dụng phần mềm vào các quy trình nghiệp vụ của một cơ quan là vô cùng thiết yếu.&nbsp;<em><span style="font-weight: 700;">Hệ thống thông tin quản lý giám sát Nhà nước tại doanh nghiệp&nbsp;</span></em>&nbsp;có những tính năng vô cùng chi tiết, ưu việt đáp ứng các yêu cầu đề bài đặt ra từ Cục Tài chính doanh nghiệp.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Cục Tài chính doanh nghiệp mong muốn xây dựng “Hệ thống thông tin Quản lý, giám sát vốn nhà nước tại doanh nghiệp” nhằm hỗ trợ quản lý thông tin doanh nghiệp, báo cáo doanh nghiệp và cơ quan Đại diện chủ sở hữu. Hệ thống cần đáp ứng các yêu cầu:</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý báo cáo của doanh nghiệp</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý báo cáo của cơ quan đại diện chủ sở hữu</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý báo cáo của sở tài chính</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý thông tin hồ sơ doanh nghiệp</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý phê duyệt, xác nhận báo cáo</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý lý do từ chối, yêu cầu hiểu chỉnh báo cáo</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý đính chính báo cáo</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý chi tiết lịch sử báo cáo</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý danh sách báo cáo quá hạn phê duyệt</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Quản lý thống kê báo cáo chưa gửi</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Tổng hợp báo cáo theo năm và các tiêu chí tổng hợp</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">+ Tạo biểu mẫu báo cáo động, …</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Đồng thời hệ thống cung cấp cho người quản lý có thể thực hiện công tác thống kê báo cáo một cách hiệu quả nhất về thông tin cũng như quản lý dữ liệu của doanh nghiệp.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Dựa trên yêu cầu đề bài đặt ra bằng cả tâm huyết và đam mê của mình, đội ngũ nhân sự SFB đã bắt tay cùng nhau tạo nên hệ thống vượt qua cả các yêu cầu đề bài mà Cục Tài chính doanh nghiệp đưa ra.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong suốt thời gian xây dựng lập trình hệ thống,&nbsp; SFB đã thực hiện onsite tại Cục Tài chính doanh nghiệp để có thể tiếp nhận những yêu cầu và mong muốn chi tiết của cán bộ chuyên viên trực tiếp sử dụng hệ thống.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">SFB luôn lắng nghe và ghi nhận những yêu cầu và góp ý của các anh chị, luôn coi trọng lợi ích và hiệu quả khai thác của người sử dụng cuối, chúng tôi hướng đến một sản phẩm cung cấp đầy đủ các chức năng cần thiết và gắn liền với việc xử lý hàng ngày của người sử dụng.</p><h2 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 22px; line-height: 26px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">2. Môi trường hoạt động</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">– Mội trường hoạt động trên website:</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Hộ trợ trình duyệt web: Google Chrome, MS Internet Explorer, Mozilla Firefox.</li><li>Mọi thiết bị như máy tính, laptop, thiết bị di động đều có thể truy cập vào website.</li></ul><h2 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 22px; line-height: 26px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">3. Chính sách bảo trì</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">– SFB không ngừng cập nhật công nghệ mới, hoàn thiện sản phẩm phù hợp với yêu cầu khách hàng.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">– Hỗ trợ khách hàng xử lý kịp thời các khúc mắc khi sử dụng phần mềm.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">– Thực hiện nghiêm túc vấn đề bảo mật thông tin. Không tiết lộ thông tin khách hàng cho bên thứ ba.</p><h2 style="margin-bottom: 10px; clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 22px; line-height: 26px; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">4. Lời cam kết</h2><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">– Chúng tôi hiểu rằng khách hàng là nhân tố quan trọng nhất trong quyết định sự phát triển của doanh nghiệp. Nhằm đáp ứng nhu cầu của quý khách hàng SFB luôn không ngừng đổi mới, nâng cao chất lượng dịch vụ.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">– Hỗ trợ training các sản phẩm phần mềm chi tiết, đầy đủ, khoa học giúp quý khách hàng có sử dụng triệt để các chức năng của phần mềm.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">– Thực hiện đầy đủ các điều khoản hợp đồng thỏa thuận giữa hai bên.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trên đây là một số nét giới thiệu chung về&nbsp;<em><span style="font-weight: 700;">Hệ thống thông tin quản lý giám sát vốn nhà nước tại doanh nghiệp.</span></em>&nbsp;Trong phạm phi tài liệu nhỏ này chúng tôi không thể giới thiệu hết những tính năng ưu việt của Phần mềm này mà nó có thể đáp ứng cho quý vị. Hãy liên hệ với chúng tôi để được tư vấn!</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Dưới đây là một số hình ảnh về các chức năng của hệ thống:</p><ol style="margin-bottom: 10px; margin-left: 20px; list-style-type: decimal; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Màn hình chi tiết dữ liệu báo cáo tài chính</li></ol><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class="aligncenter wp-image-2502 size-full" src="https://sfb.vn/wp-content/uploads/2021/01/X%C3%A1c-nh%E1%BA%ADn.png" alt="" width="1072" height="517" srcset="https://sfb.vn/wp-content/uploads/2021/01/Xác-nhận.png 1072w, https://sfb.vn/wp-content/uploads/2021/01/Xác-nhận-300x145.png 300w, https://sfb.vn/wp-content/uploads/2021/01/Xác-nhận-1024x494.png 1024w, https://sfb.vn/wp-content/uploads/2021/01/Xác-nhận-768x370.png 768w" sizes="(max-width: 1072px) 100vw, 1072px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 63.8728%; max-width: 100%;"></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">2. Màn hình chi tiết dữ liệu tổng hợp báo cáo tình hình tài chính và kết quả hoạt động SXKD của các doanh nghiệp nhà nước</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class="aligncenter wp-image-2501 size-full" src="https://sfb.vn/wp-content/uploads/2021/01/anh-1.png" alt="" width="1562" height="593" srcset="https://sfb.vn/wp-content/uploads/2021/01/anh-1.png 1562w, https://sfb.vn/wp-content/uploads/2021/01/anh-1-300x114.png 300w, https://sfb.vn/wp-content/uploads/2021/01/anh-1-1024x389.png 1024w, https://sfb.vn/wp-content/uploads/2021/01/anh-1-768x292.png 768w, https://sfb.vn/wp-content/uploads/2021/01/anh-1-1536x583.png 1536w" sizes="(max-width: 1562px) 100vw, 1562px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 81.2139%; max-width: 100%;"></p>		[]	top	f	t	t	2026-01-13 02:46:49.428545	2026-01-13 02:47:19.812568
14	4	phan-mem-quan-ly-ai-hoc-hoc-vien-cao-ang	GIẢI PHÁP PHẦN MỀM	Phần mềm quản lý giáo dục là phần mềm quản lý toàn bộ thông tin, hỗ trợ quy trình quản lý các nghiệp vụ chính trong cơ sở giáo dục như: quản lý học sinh/sinh viên/ giáo viên, quản lý đào tạo và xếp thời khóa biểu, quản lý chất lượng đào tạo, quản lý nhân sự, quản lý lương, tổng hợp và thống kê dữ liệu, phân quyền các cấp quản lý, tương tác đa người dùng.	https://beta.sfb.vn/uploads/news/BG-768x512-1768271732301-548947086.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><span style="font-weight: 700;">BÁO GIÁ SẢN PHẨM – GIẢI PHÁP QUẢN LÝ TỔNG THỂ</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Nhắc đến giáo dục là nhắc đến một hệ thống bài bản quản lý việc đào tạo con người. Vì vậy, muốn hệ thống này diễn ra trơn tru với hiệu quả cao thì sự hỗ trợ từ phần mềm quản lý giáo dục luôn là điều cần thiết, nhất là trong thời đại công nghệ phát triển mạnh mẽ như hiện nay.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Phần mềm quản lý giáo dục là phần mềm quản lý toàn bộ thông tin, hỗ trợ quy trình quản lý các nghiệp vụ chính trong cơ sở giáo dục như: quản lý học sinh/sinh viên/ giáo viên, quản lý đào tạo và xếp thời khóa biểu, quản lý chất lượng đào tạo, quản lý nhân sự, quản lý lương, tổng hợp và thống kê dữ liệu, phân quyền các cấp quản lý, tương tác đa người dùng.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Phần mềm quản lý giáo dục được vận hành nhằm giúp các đơn vị, cơ quan giáo dục có thể hoạt động thống nhất, gắn kết, ổn định với hiệu quả cao.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Chúng tôi đưa ra các giải pháp theo chi tiết như các file sau:</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Phần mềm Quản lý Tổng thể Edu_V3.0:</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><a href="https://docs.google.com/spreadsheets/d/1zOgi30YtNJUYWDXuhwg5xR9STRBSgzLD/edit?usp=sharing&amp;ouid=107311892141159106365&amp;rtpof=true&amp;sd=true" style="text-decoration: underline; color: rgb(255, 181, 54);">https://docs.google.com/spreadsheets/d/1zOgi30YtNJUYWDXuhwg5xR9STRBSgzLD/edit?usp=sharing&amp;ouid=107311892141159106365&amp;rtpof=true&amp;sd=true</a></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">&nbsp;</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Phần mềm Quản lý Tổng thể Edu_V4.0:</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><a href="https://docs.google.com/spreadsheets/d/1XPII7SeSQSr0tePB7ifHOT7CAo3NuXur/edit?usp=sharing&amp;ouid=107311892141159106365&amp;rtpof=true&amp;sd=true" style="text-decoration: underline; color: rgb(255, 181, 54);">https://docs.google.com/spreadsheets/d/1XPII7SeSQSr0tePB7ifHOT7CAo3NuXur/edit?usp=sharing&amp;ouid=107311892141159106365&amp;rtpof=true&amp;sd=true</a></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><br></p>		[]	top	t	t	t	2026-01-13 02:34:15.53671	2026-01-13 02:38:20.985847
16	6	he-thong-quan-ly-kpi-ca-nhan-bsc-kpis	GIẢI PHÁP PHẦN MỀM	Hệ thống chỉ tiêu KPI được thiết kế từ chiến lược theo phương pháp BSC. Hệ thống giúp đo lường các chỉ tiêu công ty và đánh giá hiệu KPI đơn vị, bộ phận hay cá nhân. Hệ thống cung cấp cho các cơ quan, tổ chức với mục đích thiết lập, quản lý, trực quan hoá các KPIs đảm bảo công ty, tổ chức thực thi đúng định hướng chiến lược. Một phần kết quả đánh giá KPI cá nhân được sử dụng cho quản lý nhân sự.	https://beta.sfb.vn/uploads/news/Skpi-red-768x512-1768272520503-729065855.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">Phần mềm KPI là gì?</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hệ thống quản lý BSC/KPIs cá nhân là công cụ tối ưu giúp thiết kế bảng điểm cân bằng và hệ thống chỉ tiêu KPIs.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Bảng điểm cân bằng (Balance Scoredcard – BSC)&nbsp;là phương pháp quản lý chiến lược dựa vào kết quả đo lường và đánh giá, được áp dụng cho mọi tổ chức. Nói một cách khác, BSC là phương pháp chuyển đổi tầm nhìn và chiến lược thành mục tiêu, chỉ tiêu đánh giá và hoạt động cụ thể.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hệ thống chỉ tiêu KPI được thiết kế từ chiến lược theo phương pháp BSC. Hệ thống giúp đo lường các chỉ tiêu công ty và đánh giá hiệu KPI đơn vị, bộ phận hay cá nhân. Hệ thống cung cấp cho các cơ quan, tổ chức với mục đích thiết lập, quản lý, trực quan hoá các KPIs đảm bảo công ty, tổ chức thực thi đúng định hướng chiến lược. Một phần kết quả đánh giá KPI cá nhân được sử dụng cho quản lý nhân sự.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">&nbsp;Tính năng của Hệ thống quản lý KPIs cá nhân</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Phần mềm Hệ thống quản lý BSC/KPIs cá nhân của Công ty cổ phần Công nghệ SFB là công cụ giúp công ty, doanh nghiệp, tổ chức xây dựng hệ thống chỉ tiêu đánh giá hiệu quả thực hiện công việc KPI theo Phương pháp bảng điểm cân bằng BSC. Trong đó, hiệu quả được nhìn nhận từ góc độ đạt mục tiêu chiến lược. Dưới đây là giới thiệu ngắn gọn các tính năng chính của Hệ thống quản lý BSC/KPIs cá nhân:</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;"><em>Xây dựng bộ tài liệu chỉ tiêu KPI</em></span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Phần mềm quản lý KPI giúp doanh nghiệp tự thiết lập hệ thống chỉ tiêu KPI các cấp độ từ công ty đến từng cá nhân.</li><li>Phần mềm hỗ trợ linh hoạt giúp người dùng dễ dàng nhập các chỉ tiêu KPI trong tài liệu dự thảo như: tự động hiển thị mã KPI, dễ dàng nhập các thông tin chỉ tiêu theo các danh mục hệ thống, …</li><li>Tự thiết lập và phân quyền linh hoạt cho các tài khoản từ thiết kế, nhập, duyệt, kiểm tra và theo dõi lịch sử giao dịch…</li><li>Giúp đơn giản hóa việc nhập/xuất dữ liệu khi thiết kế và xây dựng các chỉ tiêu KPI một cách đơn giản bằng cách tạo trực tiếp hoặc các bằng các biểu mẫu excel được chuẩn hóa.</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;"><em>Thực thi và đánh giá kết quả thực hiện KPI của các đơn vị, tổ chức, cá nhân &nbsp;</em></span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Hệ thống quản lý BSC/KPIs cá nhân cho phép nhập kết quả thực hiện theo từng KPI dựa trên các phương pháp đo đã khai báo.</li><li>Người dùng phần mềm KPI được phân quyền có thể theo dõi kết quả đánh giá hiệu quả công việc linh hoạt theo tần suất (tháng, quý, năm).</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;"><em>Hệ thống báo cáo KPI</em></span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Các tài liệu KPI theo chu kỳ đã được ban hành được hiển thị ở chức năng báo cáo của hệ thống quản lý KPIs cá nhân dể người dùng theo dõi. Đảm bảo thực hiện đúng tiến độ, ngày hiệu lực sau khi ban hành.</li><li>Kết quả thực hiện KPI được thể hiện dưới dạng dashboard trên phần mềm quản lý KPI với các.báo cáo sinh động, đa dạng theo từng cấp độ, theo thời gian, có so sánh giữa các năm.</li><li>Hệ thống quản lý BSC/KPIs cá nhân cho phép người dùng thiết lập cách thức xuất dữ liệu các báo cáo đánh giá hiệu quả công việc bằng các biểu mẫu được chuẩn hóa (excel, img, pdf).</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em><u><img loading="lazy" class="aligncenter wp-image-2489 size-full" src="https://sfb.vn/wp-content/uploads/2021/01/kpi.png" alt="" width="1323" height="735" srcset="https://sfb.vn/wp-content/uploads/2021/01/kpi.png 1323w, https://sfb.vn/wp-content/uploads/2021/01/kpi-300x167.png 300w, https://sfb.vn/wp-content/uploads/2021/01/kpi-1024x569.png 1024w, https://sfb.vn/wp-content/uploads/2021/01/kpi-768x427.png 768w" sizes="(max-width: 1323px) 100vw, 1323px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 85.6214%; max-width: 100%;"></u></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><em><u>Giao diện thiết lập dự thảo bộ KPI cho công ty</u></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Với các tính năng như trên, Hệ thống quản lý BSC/KPIs cá nhân không chỉ giúp các công ty, doanh nghiệp, tổ chức tự thiết lập hệ thống chỉ tiêu KPI mà còn có thể theo dõi, cập nhật kết quả đánh giá việc thực hiện các chỉ tiêu KPI và theo dõi các báo cáo thể hiện những kết quả chỉ tiêu chính yếu nhất dưới hình thức đồ thị, dashboard, hình ảnh trực quan bất cứ lúc nào, từ bất cứ đâu. Hệ thống sẽ hữu ích và tạo động lực tốt hơn cho cán bộ quản lý và nhân viên các bộ phận.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em><img loading="lazy" class="aligncenter wp-image-2490 size-full" src="https://sfb.vn/wp-content/uploads/2021/01/kpi1.png" alt="" width="1597" height="632" srcset="https://sfb.vn/wp-content/uploads/2021/01/kpi1.png 1597w, https://sfb.vn/wp-content/uploads/2021/01/kpi1-300x119.png 300w, https://sfb.vn/wp-content/uploads/2021/01/kpi1-1024x405.png 1024w, https://sfb.vn/wp-content/uploads/2021/01/kpi1-768x304.png 768w, https://sfb.vn/wp-content/uploads/2021/01/kpi1-1536x608.png 1536w" sizes="(max-width: 1597px) 100vw, 1597px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 83.0202%; max-width: 100%;"></em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; text-align: center;"><em>Giao diện trang nhắc việc của hệ thống</em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;"><em>Khả năng tích hợp hệ thống</em></span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Hệ thống quản lý BSC/KPIs cá nhân của SFB lấy dữ liệu về cơ cấu tổ chức, hệ thống phòng, ban, chức danh và nhân sự từ các hệ thống&nbsp;Thông tin nhân sự (HRM).</li><li>Hệ thống được tích hợp dịch vụ ký số (HSM), đây là một trong những tính năng quan trọng và hữu dụng của hệ thống nhằm đáp ứng được các yêu cầu về bảo mật thông tin, giúp tiết kiệm thời gian, công sức, chi phí để hoàn thành các thủ tục phát hành, giao, nhận tài liệu.</li></ul>		[]	top	f	t	t	2026-01-13 02:49:06.398988	2026-01-13 02:49:07.966702
17	17	xay-dung-he-thong-quan-ly-ly-lich-nhan-su	GIẢI PHÁP PHẦN MỀM	Trong mỗi công ty việc quản lý lý lịch nhân sự là rất cần thiết, nhờ đó bạn có thể theo dõi thông tin nhân sự của mình. Với sự phát triển CNTT hiện nay việc tin học hóa quản lý lý lịch nhân sự sẽ giúp công ty của bạn có thể ghi lại tất cả quá trình của mỗi nhân sự khi bắt đầu bước vào công ty. Nhờ vậy mà việc quản lý sẽ trở lên đơn giản hơn rất nhiều. Nhờ vậy mà việc quản lý sẽ trở lên đơn giản hơn rất nhiều.	https://beta.sfb.vn/uploads/news/NV-598x399-1768272817922-505569627.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Trong mỗi công ty việc quản lý lý lịch nhân sự là rất cần thiết, nhờ đó bạn có thể theo dõi thông tin nhân sự của mình. Với sự phát triển CNTT hiện nay việc tin học hóa quản lý lý lịch nhân sự sẽ giúp công ty của bạn có thể ghi lại tất cả quá trình của mỗi nhân sự khi bắt đầu bước vào công ty. Nhờ vậy mà việc quản lý sẽ trở lên đơn giản hơn rất nhiều.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Công nghệ triển khai:</em></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hệ thống quản lý lý lịch nhân sự được xây dựng trên nền công nghệ mới nhất Microsoft hiện nay:</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Nền tảng: asp.net 4.5</li><li>Hệ điều hành: Window Server 2008 trở lên</li><li>Hệ quản trị hệ CSDL: SQL Server 2014 hoặc cao hơn</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Tính năng nổi bật:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Quản lý thông tin cán bộ theo Mẫu Sơ yếu lý lịch cán bộ, công chức – Mẫu 2C-BNV/2008</li><li>Quản lý quá trình công tác</li><li>Quản lý quá trình khen thưởng kỷ luật</li><li>Quản lý quá trình nâng bậc nâng ngạch</li><li>Quản lý quá trình đào tạo</li><li>Cơ chế nhật ký (logging) ghi nhận tất cả các sự kiện (ai, làm gì, lúc nào)</li></ul>		[]	top	f	t	t	2026-01-13 02:54:19.149946	2026-01-13 02:54:22.685233
19	19	xay-dung-cong-thong-tin-ien-tu-cho-ai-khi-tuong-thuy-van-tinh-thai-binh	GIẢI PHÁP PHẦN MỀM	Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Sử dụng website để theo dõi dự báo thời tiết cũng là một ý tưởng sáng tạo mà SFB đã cùng với Trung tâm Khí tượng Thủy Văn Thái Bình tạo và xây dựng website.	https://beta.sfb.vn/uploads/news/kttv-504x336-1768273780511-887482848.png																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Sử dụng website để theo dõi dự báo thời tiết cũng là một ý tưởng sáng tạo mà SFB đã cùng với Trung tâm Khí tượng Thủy Văn Thái Bình tạo và xây dựng website.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Như bình thường, dự báo thời tiết sẽ giúp mọi người có thể theo dõi thời tiết trong ngày. Thì giờ đây việc sử dụng website để thông báo thời tiết sẽ giúp mọi người có thể xem dự báo thời tiết ở bất cứ đâu, bất cứ khi nào. Không phải thông tin thời tiết trong ngày, mọi người có thể theo dõi dự báo thời tiết của các ngày trước đó, thời tiết trong vòng 10 ngày tới tất cả thông tin đều được cung cấp trên website.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Đài khí tượng thủy văn tỉnh Thái Bình, thông báo dự báo thời tiết của tỉnh Thái Bình. Mọi người trong khu vực tỉnh có thể theo dõi dự báo thời tiết của khu vực mình sinh sống qua website. Là một trong những tỉnh có biển, việc theo dõi dự báo thời tiết trong 10 ngày tới sẽ giúp các bà con làng chài có thể chuẩn bị trước những thứ cần thiết để phục vụ cho công tác ra biển.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Bấm vào ảnh hoặc bấm&nbsp;<a href="http://kttvnew.thaibinh.gov.vn/" style="text-decoration: underline; color: rgb(255, 181, 54);">tại đây</a>&nbsp;để xem chi tiết:</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><a href="http://kttvnew.thaibinh.gov.vn/" style="text-decoration: underline; color: rgb(255, 181, 54);"><img loading="lazy" class="aligncenter wp-image-2336 size-full" src="https://sfb.vn/wp-content/uploads/2020/06/tttb.png" alt="" width="1349" height="2997" srcset="https://sfb.vn/wp-content/uploads/2020/06/tttb.png 1349w, https://sfb.vn/wp-content/uploads/2020/06/tttb-135x300.png 135w, https://sfb.vn/wp-content/uploads/2020/06/tttb-461x1024.png 461w, https://sfb.vn/wp-content/uploads/2020/06/tttb-768x1706.png 768w, https://sfb.vn/wp-content/uploads/2020/06/tttb-691x1536.png 691w, https://sfb.vn/wp-content/uploads/2020/06/tttb-922x2048.png 922w" sizes="(max-width: 1349px) 100vw, 1349px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 66.6558%; max-width: 100%;"></a></p>		[]	top	f	t	t	2026-01-13 03:09:43.481347	2026-01-13 03:10:04.374176
18	18	xay-dung-he-thong-quan-ly-ly-lich-khoa-hoc	GIẢI PHÁP PHẦN MỀM	Công nghệ triển khai:\n- Nền tảng: asp.net 4.0\n- Hệ điều hành: Window Server 2008 trở lên\n- Hệ quản trị hệ CSDL: SQL Server 2008 hoặc cao hơn	https://beta.sfb.vn/uploads/news/QUANLY-1768273562713-481089919.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Công nghệ triển khai:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Nền tảng: asp.net 4.0</li><li>Hệ điều hành: Window Server 2008 trở lên</li><li>Hệ quản trị hệ CSDL: SQL Server 2008 hoặc cao hơn</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Tính năng nổi bật:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li><span style="font-weight: 700;">Quản lý lý lịch khoa học:</span>&nbsp;Cho phép quản lý thông tin lý lịch khoa học của người sử dụng; Cung cấp cơ chế phê duyệt thông tin chi tiết bao gồm: thông tin người dùng, thông tin quá trình đào tạo, quá trình công tác chuyên môn, quá trình nghiên cứu khoa học; Chức năng quản lý lịch sử thay đổi của lý lịch khoa học.</li><li><span style="font-weight: 700;">Tra cứu thông tin lý lịch khoa học:</span>&nbsp;Cung cấp các chức năng cho phép người dùng tìm kiếm thông tin lý lịch khoa học; các đề tài khoa học; tìm kiếm trùng dữ liệu các dề tài khoa học.</li><li><span style="font-weight: 700;">Báo cáo – Thống kê:</span>&nbsp;Tổ chức hệ thống báo cáo thống kê lý lịch khoa học theo đơn vị, chức danh, học hàm – học vị; Báo cáo thống kê nghiên cứu khoa học theo đề tài, bài báo khoa học, giáo trình, khóa luận, tài liệu tham khảo, sách chuyên khảo.</li><li><span style="font-weight: 700;">Phân hệ trực tuyến:</span>&nbsp;Cho phép người dùng khai thác đăng nhập và chủ động công tác cập nhật thông tin thay đổi về lý lịch khoa học của mình và gửi về cán bộ quản lý; Hệ thống thực hiện gửi thông tin thay đổi và chờ phê duyệt của cán bộ quản lý.</li><li><span style="font-weight: 700;">Phân hệ danh mục:</span>&nbsp;Quản lý thông tin danh mục dùng chung trong hệ thống, bao gồm: Đơn vị; Học hàm – học vị; Cấp đề tài; Chuyên ngành đào tạo; Chức danh;…</li><li><span style="font-weight: 700;">Phân hệ quản trị hệ thống:</span>&nbsp;Cho phép quản lý phân quyền người dùng theo nhóm người dùng; Thiết lập các tham số hệ thống; Theo dõi và trích xuất dữ liệu nhật ký hệ thống.</li></ul>		[]	top	f	t	t	2026-01-13 03:06:15.212221	2026-01-13 03:06:44.047915
25	25	he-thong-truc-tich-hop-va-trao-oi-ibm	GIẢI PHÁP PHẦN MỀM		https://beta.sfb.vn/uploads/news/s0051-768x512-1768291318541-890008466.jpg																	content	<h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Công nghệ triển khai</em></h2><ol style="margin-bottom: 10px; margin-left: 20px; list-style-type: decimal; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>IBM Integration Bus</li><li>IBM MQ server</li></ol><h2 style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Tính năng nổi bật</em></h2><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Kết nối mọi ứng dụng với nhau</li><li>Chuyển đổi khuân dạng dữ liệu giữa các ứng dụng</li><li>Chuyển đổi các giao thức kết nối đa dạng</li><li>Phân phối các thành phần nghiệp vụ</li><li>Định tuyến các kết nối theo nhu cầu</li></ul>		[]	top	t	t	t	2026-01-13 08:01:46.990133	2026-01-13 08:02:55.014412
20	20	xay-dung-trang-thuong-mai-ien-tu-thiet-bi-truong-hoc-ngoc-anh	GIẢI PHÁP PHẦN MỀM 	Ngày nay công nghệ đang ngày một phát triển, vì vậy việc quản lý mọi thông tin khách hàng cũng như sản phẩm kinh doanh trên nền công nghệ thông tin là rất hữu dụng. Hiểu được điều đó Công ty SFB đã cùng với quý khách hàng phát triển website Thiết bị trường học Ngọc Anh.	https://beta.sfb.vn/uploads/news/tb-640x426-1768276233539-26403185.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Ngày nay công nghệ đang ngày một phát triển, vì vậy việc quản lý mọi thông tin khách hàng cũng như sản phẩm kinh doanh trên nền công nghệ thông tin là rất hữu dụng. Hiểu được điều đó Công ty SFB đã cùng với quý khách hàng phát triển website&nbsp;<span style="font-weight: 700;">Thiết bị trường học Ngọc Anh</span>. Với mục đích đưa website Thiết bị trường học Ngọc Anh vào sử dụng sẽ giúp khách hàng :</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Xây dựng và quảng bá thương hiệu</li><li>Người sử dụng tiếp cận được nhiều khách hàng tiềm năng</li><li>Hỗ trợ khách hàng 24/24</li><li>Tăng hiệu quả kinh doanh</li><li>Tăng năng lực cạnh tranh</li><li>Tăng lợi nhuận</li><li>Cập nhật thông tin sản phẩm một cách nhanh chóng</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Nhờ đó mà sản phẩm của bạn sẽ ngày càng được biết đến trên diện rộng và chắc chắn rằng doanh nghiệp của bạn sẽ ngày một phát triển hơn.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><img loading="lazy" class="aligncenter wp-image-2292 size-full" src="https://sfb.vn/wp-content/uploads/2020/06/wsna.png" alt="" width="1349" height="2056" srcset="https://sfb.vn/wp-content/uploads/2020/06/wsna.png 1349w, https://sfb.vn/wp-content/uploads/2020/06/wsna-197x300.png 197w, https://sfb.vn/wp-content/uploads/2020/06/wsna-672x1024.png 672w, https://sfb.vn/wp-content/uploads/2020/06/wsna-768x1171.png 768w, https://sfb.vn/wp-content/uploads/2020/06/wsna-1008x1536.png 1008w, https://sfb.vn/wp-content/uploads/2020/06/wsna-1344x2048.png 1344w" sizes="(max-width: 1349px) 100vw, 1349px" style="margin-right: auto; margin-bottom: 10px; margin-left: auto; border-style: initial; border-color: initial; clear: both; height: auto; width: 60.0704%; max-width: 100%;"></p>		[]	top	f	t	t	2026-01-13 03:49:59.84458	2026-01-13 04:03:07.649922
21	21	dich-vu	GIẢI PHÁP PHẦN MỀM	SFB cung cấp dịch vụ Tư vấn xây dựng chiến lược CNTT cho các Doanh nghiệp, Cơ quan, Tổ chức nhằm hỗ trợ Doanh nghiệp, Cơ quan, Tổ chức xây dựng được một hệ thống CNTT mang tính tổng thể và thống nhất, đáp ứng toàn diện các nhu cầu quản lý của các Doanh nghiệp, Cơ quan, Tổ chức. SFB giúp khách hàng xác định chi tiết yêu cầu hệ thống, từ đó đưa ra các phương án tổng thể xây dựng hệ thống thông tin tối ưu	https://beta.sfb.vn/uploads/news/h--nh----nh-b--a-1-649x433-1768277296874-795977893.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">TƯ VẤN DỊCH VỤ CÔNG NGHỆ THÔNG TIN</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">SFB cung cấp dịch vụ Tư vấn xây dựng chiến lược CNTT cho các Doanh nghiệp, Cơ quan, Tổ chức nhằm hỗ trợ Doanh nghiệp, Cơ quan, Tổ chức xây dựng được một hệ thống CNTT mang tính tổng thể và thống nhất, đáp ứng toàn diện các nhu cầu quản lý của các Doanh nghiệp, Cơ quan, Tổ chức.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">SFB giúp khách hàng xác định chi tiết yêu cầu hệ thống, từ đó đưa ra các phương án tổng thể xây dựng hệ thống thông tin tối ưu:</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Tư vấn xây dựng hệ thống</li><li>Tư vấn xây dựng các bài toán ứng dụng</li><li>Tư vấn xây dựng các giải pháp chuyên dụng.</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">&nbsp;TÍCH HỢP HỆ THỐNG</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Với đội ngũ chuyên gia nhiều kinh nghiệm, với quan hệ đối tác với các hãng hàng đầu về CNTT trên thế giới, SFB đem lại cho khách hàng các dịch vụ chuyên nghiệp về tích hợp hệ thống như:</p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Giải pháp về hệ thống máy chủ – lưu trữ.</li><li>Giải pháp cơ sở dữ liệu.</li><li>Giải pháp mạng và truyền thông hợp nhất.</li><li>Giải pháp và dịch vụ an toàn, bảo mật thông tin.</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">XÂY DỰNG VÀ QUẢN TRỊ WEBSITE</span></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Xây dựng website chuyên nghiệp, website công ty luôn được cập nhật nội dung với công nghệ xử lý hình ảnh cao.</li><li>Chi phí hơp lý, hiệu quả cao</li><li>Kết nối mạng xã hội.</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">PHÁT TRIỂN ỨNG DỤNG VÀ BẢO TRÌ</span></p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">SFB luôn bên cạnh hỗ trợ khách hàng trong suốt quá trình vận hành hệ thống.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hỗ trợ khách hàng xử lý kịp thời các khúc mắc khi sử dụng phần mềm. Hỗ trợ đào tạo trực tiếp sử dụng các tính năng của hệ thống để khách hàng có thể sử dụng triệt để các tính năng của phần mềm.</p>		[]	top	f	t	t	2026-01-13 04:09:03.579444	2026-01-13 04:22:26.63183
23	23	microsoft-lync-server	GIẢI PHÁP PHẦN MỀM	Lync tích hợp tin nhắn tức thời (instant messaging, kết nối tới cả Yahoo Messenger, AOL, MSN, Gtalk…), hội họp hỗ trợ âm thanh/hình ảnh (audio/video conferencing, kết nối tới smartphone, PC và hội họp qua web. Đương nhiên, Lync cũng có chức năng ghi lại các cuộc hội họp đó (ghi lại âm thanh, hình ảnh, lưu lại dữ liệu chia sẻ…). Lync có một giao diện thân thuộc, tích hợp với những ứng dụng như Microsoft Office, Sharepoint và Exchange… Microsoft Lync cho phép tích hợp hệ thống tổng đài doanh nghiệp như PBX nhằm tiết kiệm chi phí và thời gian.	https://beta.sfb.vn/uploads/news/nhung-hinh-nen-ve-cong-nghe-thong-tin-dep-cho-powerpoint-anh-10-768x512-1768290247281-775640995.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Được coi là giải pháp thay thế các phương tiện giao tiếp truyền thống trong doanh nghiệp, Microsoft Lync giúp liên kết người dùng mọi nơi và mọi lúc thông qua việc kết nối các thiết bị truyền thông thông dụng của người dùng như máy tính, điện thoại bàn, điện thoại di động và trình duyệt web trong một nền tảng giao tiếp duy nhất.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Lync tích hợp tin nhắn tức thời (instant messaging, kết nối tới cả Yahoo Messenger, AOL, MSN, Gtalk…), hội họp hỗ trợ âm thanh/hình ảnh (audio/video conferencing, kết nối tới smartphone, PC và hội họp qua web. Đương nhiên, Lync cũng có chức năng ghi lại các cuộc hội họp đó (ghi lại âm thanh, hình ảnh, lưu lại dữ liệu chia sẻ…). Lync có một giao diện thân thuộc, tích hợp với những ứng dụng như Microsoft Office, Sharepoint và Exchange… Microsoft Lync cho phép tích hợp hệ thống tổng đài doanh nghiệp như PBX nhằm tiết kiệm chi phí và thời gian.</p><table width="624" style="margin-bottom: 10px; border-spacing: 0px; border-bottom-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 916.375px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><tbody><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;"><p style="margin-bottom: 10px; text-align: center;"><span style="font-weight: 700;">Tính năng</span></p></td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;"><p style="margin-bottom: 10px; text-align: center;"><span style="font-weight: 700;">Mô tả</span></p></td></tr><tr><td colspan="2" width="624" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 901.375px;"><span style="font-weight: 700;">Tính năng cơ bản (mặc định users được phép sử dụng)</span></td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">IM Chat</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Trao đổi tin nhắn nhanh (Instant Message)</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">IM Conferencing</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Hội thoại IM giữa nhiều người</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Voice chat</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Trao đổi thông tin qua giọng nói</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Voice Conferencing</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Hội thoại voice giữa nhiều người</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Video chat</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Trao đổi thông tin qua hình ảnh</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Video Conferencing</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Hội thảo video trực tuyến giữa nhiều người</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Presence</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Nhận diện trạng thái hiện hữu của người dùng<br>(Online/Offline/Busy…)</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">File transfer</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Gửi file trực tiếp giữa người dùng</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Desktop sharing</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Chia sẻ màn hình desktop cho người dùng khác</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Web Access</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Truy cập Lync Server thông qua trình duyệt web</td></tr><tr><td colspan="2" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 901.375px;"><span style="font-weight: 700;">Tính năng nâng cao</span></td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Archiving</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Lưu trữ thông tin về IM trao đổi và chi tiết cuộc thoại</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Live Meeting<br>(Web Conferencing)</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Họp trực tuyến, trình diễn slide show trực tuyến</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Enterprise Voice</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Các tính năng nâng cao về voice như tích hợp với các sản phẩm MS Office, Sharepoint…</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Voice mail</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Hộp thư thoại</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">External access</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Truy cập từ ngoài Internet</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Public IM</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Kết nối với Yahoo/MSN (optional)</td></tr><tr><td width="347" style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 504.609px;">Telephony Integration</td><td style="padding: 5px 10px 5px 5px; border-top-width: 1px; border-color: rgba(51, 51, 51, 0.12); width: 381.766px;">Tích hợp Lync Server với hệ thống IP Phone khác hoặc PBX, thực hiện các cuộc gọi tới hệ thống điện thoại</td></tr></tbody></table>		[]	top	t	t	t	2026-01-13 07:43:24.317585	2026-01-13 07:44:46.608951
22	22	he-thong-giai-phap-xay-dung-theo-yeu-cau-khach-hang	GIẢI PHÁP PHẦN MỀM 	SFB thực hiện tham gia tư vấn, phân tích, khảo sát nghiệp vụ và công nghệ thông tin hóa hỗ trợ tối ưu quy trình nghiệp vụ của khách hàng.	https://beta.sfb.vn/uploads/news/kpi-500x333-1--1--1768289024549-886556444.png																	content	<div class="vc_row wpb_row vc_row-fluid vc_custom_1591170699274" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px; margin-bottom: 30px !important;"><div class="wpb_column vc_column_container vc_col-sm-12" style="width: 1250px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 1250px;"><div class="wpb_wrapper"><div class="wpb_text_column wpb_content_element "><div class="wpb_wrapper"><p style="margin-bottom: 10px;">SFB thực hiện tham gia tư vấn, phân tích, khảo sát nghiệp vụ và công nghệ thông tin hóa hỗ trợ tối ưu quy trình nghiệp vụ của khách hàng.</p><p>Các công nghệ đáp ứng:</p></div></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-4154" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-4154 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Programming Languages</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-4154 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; Java (JSP, Servlets, JDBC, etc.),<br>J2SE/J2EE (EJB, Hybernate, Spring MVC, SQLJ, etc.)<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; C#/C/C++</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; C#.NET, VB.NET, ASP.NET, ADO.NET, COM+</p></div></div></div></div></div></div><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-1612" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-1612 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Application Servers</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-1612 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; IIB, MQ Server<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; IBM WebSphere Application Server</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Oracle AS</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; SAP Application Server</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Jakarta Tomcat</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Apache</p></div></div></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-12" style="width: 1250px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 1250px;"><div class="wpb_wrapper"><div class="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text vc_sep_color_grey vc_custom_1591170676249  vc_custom_1591170676249" style="margin-right: auto; margin-left: auto; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; flex-flow: row; -webkit-box-align: center; align-items: center; width: 1200px; margin-bottom: 20px !important;"><span class="vc_sep_holder vc_sep_holder_l" style="height: 1px; position: relative; -webkit-box-flex: 1; flex: 1 1 auto; min-width: 10%; width: 1200px;"><span class="vc_sep_line" style="height: 1px; border-top-width: 1px; border-color: rgb(235, 235, 235); display: block; position: relative; top: 1px; width: 1200px;"></span></span></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-5159" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-5159 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Mark-up and Scripting Technologies</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-5159 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; HTML, DHTML, XHTML<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; XML, XSLT, XSL</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; &nbsp;ASP, ASP.NET</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; &nbsp;Java Script, Visual Basic Script</p></div></div></div></div></div></div><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-8373" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-8373 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Operating Systems</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-8373 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; Unix<br>(Sun Solaris, HP-UX, AIX, Sys V)<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Microsoft Windows</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Linux (RHEL, Debian, SuSE)</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Microsoft Windows CE</p></div></div></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-12" style="width: 1250px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 1250px;"><div class="wpb_wrapper"><div class="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text vc_sep_color_grey vc_custom_1591170676249  vc_custom_1591170676249" style="margin-right: auto; margin-left: auto; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; flex-flow: row; -webkit-box-align: center; align-items: center; width: 1200px; margin-bottom: 20px !important;"><span class="vc_sep_holder vc_sep_holder_l" style="height: 1px; position: relative; -webkit-box-flex: 1; flex: 1 1 auto; min-width: 10%; width: 1200px;"><span class="vc_sep_line" style="height: 1px; border-top-width: 1px; border-color: rgb(235, 235, 235); display: block; position: relative; top: 1px; width: 1200px;"></span></span></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-4657" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-4657 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Relational Database Management Systems (RDBMS)</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-4657 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; Oracle 8i, 9i, 10g; Oracle RAC<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Microsoft SQL Server Family</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Sybase</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; MySQL/PostgreSQL</p></div></div></div></div></div></div><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-3516" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-3516 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Integrated Development Environments (IDE)</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-3516 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; Microsoft Visual Studio .NET<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; PL/SQL Developer</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; IBM WebSphere Studio Application Developer</p></div></div></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-12" style="width: 1250px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 1250px;"><div class="wpb_wrapper"><div class="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text vc_sep_color_grey vc_custom_1591170676249  vc_custom_1591170676249" style="margin-right: auto; margin-left: auto; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; flex-flow: row; -webkit-box-align: center; align-items: center; width: 1200px; margin-bottom: 20px !important;"><span class="vc_sep_holder vc_sep_holder_l" style="height: 1px; position: relative; -webkit-box-flex: 1; flex: 1 1 auto; min-width: 10%; width: 1200px;"><span class="vc_sep_line" style="height: 1px; border-top-width: 1px; border-color: rgb(235, 235, 235); display: block; position: relative; top: 1px; width: 1200px;"></span></span></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-9670" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-9670 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Web Servers</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-9670 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; Apache<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Microsoft IIS</p></div></div></div></div></div></div><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-3645" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-3645 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Portal Servers</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-3645 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; IBM WebSphere Portal Server<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Microsoft Sharepoint Server</p></div></div></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-12" style="width: 1250px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 1250px;"><div class="wpb_wrapper"><div class="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text vc_sep_color_grey vc_custom_1591170676249  vc_custom_1591170676249" style="margin-right: auto; margin-left: auto; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; flex-flow: row; -webkit-box-align: center; align-items: center; width: 1200px; margin-bottom: 20px !important;"><span class="vc_sep_holder vc_sep_holder_l" style="height: 1px; position: relative; -webkit-box-flex: 1; flex: 1 1 auto; min-width: 10%; width: 1200px;"><span class="vc_sep_line" style="height: 1px; border-top-width: 1px; border-color: rgb(235, 235, 235); display: block; position: relative; top: 1px; width: 1200px;"></span></span></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-3996" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-3996 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Management Methodologies and Tools</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-3996 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; IBM RUP<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; CMMI</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Microsoft Project</p></div></div></div></div></div></div><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-8790" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-8790 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Modelling and CASE Tools</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-8790 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; IBM Rational Rose<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Microsoft Visio</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Erwin</p></div></div></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-12" style="width: 1250px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 1250px;"><div class="wpb_wrapper"><div class="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text vc_sep_color_grey vc_custom_1591170676249  vc_custom_1591170676249" style="margin-right: auto; margin-left: auto; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; flex-flow: row; -webkit-box-align: center; align-items: center; width: 1200px; margin-bottom: 20px !important;"><span class="vc_sep_holder vc_sep_holder_l" style="height: 1px; position: relative; -webkit-box-flex: 1; flex: 1 1 auto; min-width: 10%; width: 1200px;"><span class="vc_sep_line" style="height: 1px; border-top-width: 1px; border-color: rgb(235, 235, 235); display: block; position: relative; top: 1px; width: 1200px;"></span></span></div></div></div></div></div><div class="vc_row wpb_row vc_row-fluid" style="margin-right: -25px; margin-left: -25px; position: relative; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-6421" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-6421 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Microsoft Sharepoint server</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-6421 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; Sharepoint portal<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Sharepoint application</p></div></div></div></div></div></div><div class="wpb_column vc_column_container vc_col-sm-6" style="width: 625px; position: relative; min-height: 1px; float: left;"><div class="vc_column-inner" style="padding-right: 25px; padding-left: 25px; width: 625px;"><div class="wpb_wrapper"><div class="aio-icon-component    style_1" style="margin-bottom: 35px;"><div id="Info-box-wrap-2045" class="aio-icon-box default-icon"><div class="aio-icon-header" style="display: table-cell; vertical-align: middle;"><h3 class="aio-icon-title ult-responsive" data-ultimate-target="#Info-box-wrap-2045 .aio-icon-title" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="clear: none; color: rgb(0, 111, 179); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-language-override: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1.2em; font-family: &quot;Open Sans Condensed&quot;, Helvetica, Arial, Verdana, sans-serif; text-transform: uppercase;">Mobile Application</h3></div><div class="aio-icon-description ult-responsive" data-ultimate-target="#Info-box-wrap-2045 .aio-icon-description" data-responsive-json-new="{&quot;font-size&quot;:&quot;&quot;,&quot;line-height&quot;:&quot;&quot;}" style="margin-top: 10px; width: 575px;">·&nbsp; ReactJS (iOS, Android)<p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;"></p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Swift (iOS)</p><p style="margin-bottom: 10px; font-family: inherit !important; font-weight: inherit !important; font-size: inherit !important; font-style: inherit !important; color: inherit !important; line-height: inherit !important;">·&nbsp; Java (Android)</p></div></div></div></div></div></div></div>		[]	top	f	t	t	2026-01-13 07:24:01.042953	2026-01-13 07:30:05.58243
24	24	he-thong-email-ien-tu	GIẢI PHÁP PHẦN MỀM	Exchange Server là phần mềm máy chủ do Microsoft phát triển chuyên phục vụ các giải pháp e-mail và trao đổi thông tin trong doanh nghiệp. Tiếp nối thành công của những phiên bản trước, Microsoft đã chính thức ra mắt phiên bản Exchange Server 2016. Phiên bản này giúp đơn giản hóa công việc quản lý, bảo vệ thông tin liên lạc và đặc biệt là đáp ứng nhu cầu của doanh nghiệp trong việc đồng bộ hóa các thiết bị di động.	https://beta.sfb.vn/uploads/news/0c71b9b5-94e8-464c-849f-8350258ec8f6-487x324-1768290819550-24314374.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Microsoft Exchange</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Exchange Server là phần mềm máy chủ do Microsoft phát triển chuyên phục vụ các giải pháp e-mail và trao đổi thông tin trong doanh nghiệp. Tiếp nối thành công của những phiên bản trước, Microsoft đã chính thức ra mắt phiên bản Exchange Server 2016.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Phiên bản này giúp đơn giản hóa công việc quản lý, bảo vệ thông tin liên lạc và đặc biệt là đáp ứng nhu cầu của doanh nghiệp trong việc đồng bộ hóa các thiết bị di động.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><span style="font-weight: 700;">TÍNH ƯU VIỆT CỦA EXCHANGE SERVER 2016</span></p><ol style="margin-bottom: 10px; margin-left: 20px; list-style-type: decimal; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li><span style="font-weight: 700;">Bảo vệ và tuân thủ các chính sách e-mail</span></li></ol><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Hiện nay, việc quản lý e-mail tuân thủ theo chính sách của doanh nghiệp đã trở thành một thách thức lớn. Vấn đề ở chỗ khi dung lượng mail của user lớn hơn dung lượng hộp thư cho phép, user thường di chuyển các thư này sang LAPTOP hoặc PC khác dưới dạng file PST. Điều này gây khó khăn cho việc quản lý cũng như tìm kiếm mail khi có nhu cầu.Vì vậy, Exchange Server 2016&nbsp;đã đưa ra một tính năng mới là tích hợp khả năng lưu trữ và duy trì email trực tiếp.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Bên cạnh đó, việc bảo mật thông tin cho các email vô cùng quan trọng. Exchange 2016 hỗ trợ người dùng kiểm soát và bảo mật thông tin một cách dễ dàng thông qua tính năng Rights Management Rules. Đây là trung tâm kiểm soát nhằm hỗ trợ việc quản lý, mã hóa và ngăn chặn email một cách hiệu quả mà người dùng có thể tự thiết lập chế độ bảo vệ dữ liệu riêng của mình.<br>Điểm đáng chú ý là Exchange Server 2016&nbsp;còn có thể ngăn chặn các mail spam, lọc mail và ngăn chặn các phần mềm gián điệp thông qua sản phẩm Microsoft Forefront Security for Exchange Server.</p><ol start="2" style="margin-bottom: 10px; margin-left: 20px; list-style-type: decimal; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li><span style="font-weight: 700;">Truy cập mọi nơi</span></li></ol><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Mức độ thành công trong công việc tùy thuộc vào năng suất và hiệu quả làm việc của user thông qua các giải pháp công nghệ đã lựa chọn sử dụng. Exchange Server 2016&nbsp;hỗ trợ người dùng làm việc hiệu quả hơn bằng cách cho phép truy cập tự do và an toàn vào tất cả các thông tin liên lạc của mình như: E-mail, Thư thoại, Tin nhắn… từ bất kỳ hệ điều hành, trình duyệt Web hoặc thiết bị di động thông qua các chuẩn giao thức công nghiệp.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Ngoài ra, Exchange Server 2016&nbsp;tích hợp thêm chức năng cho xem thông tin của mail theo dạng chủ đề xuyên suốt các hộp thư, điều này giúp các user thuận tiện rất nhiều trong công việc. Ngoài ra, Exchange Server 2016&nbsp;còn hỗ trợ tính năng gỡ bỏ 1 ai đó ra khỏi các cuộc trao đổi dễ dàng chỉ với một cú click chuột.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Một tính năng nổi trội trong Exchange 2016&nbsp;phải kế đến là Voice Mail. Trong Exchange Server 2016, người dùng có thể nhận voice mail trực tiếp ngay trong Inbox, xử lý các voice mail như e-mail trên Microsoft Outlook hoặc Oultook Web Access. Khi bạn nhận được voice mail, tính năng “Speech to text” trong Exchange Server 2016&nbsp;ngay lập tức sẽ tự động hiển thị dưới dạng văn bản, user có thể đọc trực tiếp nội dung kèm theo việc nghe lại voice mail (chỉ áp dụng đối với ngôn ngữ English).</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Ngoài ra, hiểu được nhu cầu nhắn tin (SMS), chat và email giữa các user, Exchange Server 2016&nbsp;đã tích hợp các chức năng trên vào một chỗ, rất thuận tiện cho người dùng. Chỉ cần mở Microsoft Outlook, bạn hoàn toàn có thể nhắn tin, chat hoặc thậm chí là gọi điện di động đến các thành viên trong công ty.</p><ol start="3" style="margin-bottom: 10px; margin-left: 20px; list-style-type: decimal; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li><span style="font-weight: 700;">Đảm bảo tính&nbsp;Linh&nbsp;</span><span style="font-weight: 700;">hoạt</span><span style="font-weight: 700;">&nbsp;và&nbsp;Khả năng lưu trữ, phục hồi dữ liệu</span></li></ol><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Exchange Server 2016&nbsp;mang lại sự linh động cho doanh nghiệp, giúp cho hệ thống Mail Server được hoạt động liên tục trong bất kỳ hoàn cảnh nào. Đáng lưu ý nhất là việc lưu trữ trên Exchange nay đã có thêm tùy chọn mới JBOD bao gồm ổ cứng SATA và đĩa RAID, giúp lưu trữ các mailbox database lớn với chi phí thấp nhất.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Tính năng&nbsp;<span style="font-weight: 700;">Continous Replication</span>&nbsp;đã được triển khai, trong phiên bản Exchange Server 2016&nbsp;đã được cải thiện rất nhiều với khả năng khôi phục dữ liệu một cách nhanh chóng, và đồng bộ hóa dữ liệu giữa các datacenter. Ngoài ra Exchange Server 2016&nbsp;còn có thêm tính năng&nbsp;<span style="font-weight: 700;">Online Mailbox Moves</span>, cho phép Admin có thể di chuyển các mailbox giữa các database mà không cần thiết lập chế độ Offline. User vẫn có thể kết nối đến mailbox của họ, gửi và nhận mail bình thường trong khi mailbox di chuyển sang một nơi khác.</p>		[]	top	t	t	t	2026-01-13 07:53:42.027333	2026-01-13 07:53:59.114322
26	26	phan-mem-quan-ly-nghien-cuu-khoa-hoc	GIẢI PHÁP PHẦN MỀM	Phần mềm quản lý đề tài nghiên cứu khoa học và công nghệ SFB có chức năng giúp các cơ quan, doanh nghiệp lưu trữ và phân loại các đề tài nghiên cứu khoa học, công nghệ theo danh mục để tra cứu dễ dàng, với phần mềm quản lý đề tài nghiên cứu khoa học và công nghệ SFB các cơ quan, doanh nghiệp sẽ lưu lại được tài liệu cực kỳ quan trọng phục vụ cho mục đích tham khảo nghiên cứu và ứng dụng vào thực tiễn.	https://beta.sfb.vn/uploads/news/Nghi--n-c---u-khoa-h---c-675x450-1768291799022-345816272.jpg																	content	<p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Phần mềm quản lý đề tài nghiên cứu khoa học và công nghệ SFB có chức năng giúp các cơ quan, doanh nghiệp lưu trữ và phân loại các đề tài nghiên cứu khoa học, công nghệ theo danh mục để tra cứu dễ dàng, với phần mềm quản lý đề tài nghiên cứu khoa học và công nghệ SFB các cơ quan, doanh nghiệp sẽ lưu lại được tài liệu cực kỳ quan trọng phục vụ cho mục đích tham khảo nghiên cứu và ứng dụng vào thực tiễn.</p><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Công nghệ triển khai:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li>Nền tảng: asp.net 4.0</li><li>Hệ điều hành: Window Server 2008 trở lên</li><li>Hệ quản trị hệ CSDL: SQL Server 2008 hoặc cao hơn</li></ul><p style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><em>Tính năng nổi bật:</em></p><ul style="margin-bottom: 10px; margin-left: 20px; list-style-type: disc; color: rgb(51, 51, 51); font-family: Roboto, Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"><li><span style="font-weight: 700;">Phân hệ Quản lý lý lịch khoa học</span>: Cho cán bộ nghiệp vụ quản lý thông tin các lý lịch khoa học của cán bộ, chiến sỹ trong Học viện. Cán bộ nghiệp vụ tiếp nhận / từ chối xác minh các lý lịch chờ xác minh. Hệ thống cho phép in lý lịch, xử lý cập nhật thông tin lý lịch theo lô,…</li><li><span style="font-weight: 700;">Phân hệ Tìm kiếm dữ liệu</span>: Hỗ trợ cán bộ nghiệp vụ tìm kiếm hoặc tra cứu nhanh thông tin lý lịch; thông tin nghiên cứu khoa học và kiểm tra trùng tiêu đề các nghiên cứu khoa học.</li><li><span style="font-weight: 700;">Phân hệ Báo cáo – Thống kê:</span>&nbsp;Cho phép cán bộ nghiệp vụ thực hiện báo cáo thống kê theo nhiều tiêu chí khác nhau lý lịch; nhóm nghiên cứu khoa học.</li><li><span style="font-weight: 700;">Phân hệ Trang đăng ký:&nbsp;</span>Cho phép cán bộ, chiến sỹ tại Học viện vào kê khai bổ sung thông tin lý lịch khoa học và gửi về cho Phòng Quản lý nghiên cứu khoa học để chờ xác minh.</li><li><span style="font-weight: 700;">Phân hệ Đ</span><span style="font-weight: 700;">ăng ký và nhắc việc nghiên cứu khoa học</span>: Cán bộ đăng ký nghiên cứu khoa học; Hệ thống đưa ra cảnh báo nắc việc nghiên cứu khoa học cho cán bộ và phòng quản lý đề tài theo: Trạng thái, Thời gian,…; Kiểm soát số lần gia hạn, quá hạn thực hiện nghiên cứu khoa học của cán bộ.</li><li><span style="font-weight: 700;">Phân hệ&nbsp;</span><span style="font-weight: 700;">Tìm kiếm và tra cứu&nbsp;</span>trùng<span style="font-weight: 700;">&nbsp;dữ liệu toàn văn:&nbsp;</span>Đánh chỉ mục toàn văn Tìm kiếm trùng dữ liệu theo tỷ lệ,…</li><li><span style="font-weight: 700;">Phân hệ Danh mục hệ thống</span></li><li><span style="font-weight: 700;">Phân hệ Quản trị hệ thống</span></li></ul>		[]	top	t	t	t	2026-01-13 08:10:12.60093	2026-01-13 08:10:17.634578
\.


--
-- TOC entry 3940 (class 0 OID 20319)
-- Dependencies: 235
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, category_id, slug, name, tagline, meta, description, image, gradient, pricing, badge, stats_users, stats_rating, stats_deploy, features, demo_link, seo_title, seo_description, seo_keywords, sort_order, is_featured, is_active, created_at, updated_at) FROM stdin;
1	2	he-thong-tuyen-sinh-dau-cap	Hệ thống tuyển sinh đầu cấp	Tuyển sinh trực tuyến minh bạch, đúng quy chế	Sản phẩm • Tin công nghệ • 07/08/2025	Phần mềm hỗ trợ công tác tuyển sinh đầu cấp cho nhà trường và phụ huynh: tổ chức tuyển sinh đúng quy chế, minh bạch, tra cứu kết quả trực tuyến mọi lúc mọi nơi.	https://sfb.vn/wp-content/uploads/2025/08/HDD-404x269.png	from-[#006FB3] to-[#0088D9]	Liên hệ	Giải pháp nổi bật	Nhiều trường học áp dụng	4.8	Triển khai Cloud/On-premise	["Đăng ký tuyển sinh trực tuyến cho phụ huynh", "Tích hợp quy chế tuyển sinh của Bộ/Ngành", "Tự động lọc, duyệt hồ sơ theo tiêu chí", "Tra cứu kết quả tuyển sinh online", "Báo cáo thống kê theo lớp, khối, khu vực", "Kết nối chặt chẽ giữa phụ huynh và nhà trường"]	https://drive.google.com/drive/u/0/folders/1hc4698gfpR6Y1pDZTa6h9e2yVVB6Lky8				1	t	t	2026-01-10 02:59:52.987173	2026-01-10 04:44:26.444479
11	6	dich-vu-tu-van-xay-dung-va-phat-trien-he-thong	DỊCH VỤ TƯ VẤN XÂY DỰNG VÀ PHÁT TRIỂN HỆ THỐNG	Đáp ứng mong muốn cho doanh nghiệp của bạn	Sản phẩm01/06/2020	SFB hiện diện để tư vấn xây dựng và phát triển hệ thống hiểu được rõ yêu cầu của khách hàng. Từ đó, việc vận hành xây dựng hệ thống sẽ sát với nhu cầu người dùng. SFB lập kế hoạch và phát triển hệ thống nhằm nâng cao năng suất công việc, giảm chi phí và tăng doanh thu,… Song song với việc tư vấn, đội ngũ lập trình viên rất am tường của chúng tôi sẽ thiết kế và phát triển hệ thống phù hợp với nhu cầu cuả khách hàng.	https://beta.sfb.vn/uploads/news/LV-600x400-1768016124328-473978690.gif	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		[]					0	f	t	2026-01-10 03:32:16.848576	2026-01-13 02:30:53.813815
5	4	he-thong-thong-tin-quan-ly-giam-sat-doanh-nghiep	Hệ thống thông tin quản lý, giám sát doanh nghiệp	Giám sát doanh nghiệp Nhà nước hiệu quả	Sản phẩm • 16/01/2021	Hệ thống thông tin quản lý, giám sát Nhà nước tại doanh nghiệp, hỗ trợ cơ quan quản lý nắm bắt tình hình hoạt động và chỉ tiêu của doanh nghiệp một cách chi tiết.	https://sfb.vn/wp-content/uploads/2021/01/btc-255x170.png	from-indigo-600 to-purple-600	Thiết kế theo bài toán		Cơ quan quản lý Nhà nước	4.8	Triển khai tập trung	["Quản lý hồ sơ, thông tin doanh nghiệp", "Theo dõi tình hình tài chính và sản xuất kinh doanh", "Bộ chỉ tiêu báo cáo chuẩn hóa", "Cảnh báo sớm các rủi ro, vi phạm", "Dashboard giám sát trực quan theo ngành/lĩnh vực", "Kết nối, chia sẻ dữ liệu với hệ thống khác"]					5	f	t	2026-01-10 02:59:52.987173	2026-01-13 02:47:19.677507
4	2	phan-mem-quan-ly-dai-hoc-hoc-vien-cao-dang	Phần mềm quản lý Đại học – Học viện – Cao đẳng	Giải pháp quản lý tổng thể cơ sở đào tạo	Sản phẩm • 01/11/2022	Giải pháp quản lý tổng thể dành cho các trường Đại học, Học viện, Cao đẳng, hỗ trợ quản lý đào tạo, sinh viên, chương trình học và chất lượng đào tạo.	https://sfb.vn/wp-content/uploads/2022/11/BG-768x512.png	from-emerald-600 to-teal-600	Theo quy mô trường	Giải pháp tổng thể	Phù hợp ĐH, HV, CĐ	4.7	Cloud/On-premise	["Quản lý tuyển sinh, hồ sơ sinh viên", "Quản lý chương trình đào tạo, tín chỉ, lớp học", "Quản lý giảng viên, phân công giảng dạy", "Cổng thông tin cho sinh viên & giảng viên", "Quản lý học phí, công nợ, học bổng", "Báo cáo theo chuẩn Bộ/Ngành"]					4	t	t	2026-01-10 02:59:52.987173	2026-01-13 02:38:20.908131
6	5	he-thong-quan-ly-kpi-ca-nhan-bsc-kpis	Hệ thống quản lý KPI cá nhân (BSC/KPIs)	Quản trị hiệu suất cá nhân & tổ chức	Sản phẩm • 16/01/2021	Hệ thống quản lý BSC/KPIs cá nhân giúp thiết kế bảng điểm cân bằng và hệ thống chỉ tiêu KPI, hỗ trợ đo lường và đánh giá hiệu quả công việc.	https://sfb.vn/wp-content/uploads/2021/02/Skpi-red-768x512.png	from-red-600 to-rose-600	Tùy theo số lượng user	Tập trung KPI	Doanh nghiệp mọi quy mô	4.7	Cloud/On-premise	["Thiết kế BSC và hệ thống chỉ tiêu KPI", "Giao KPI theo cá nhân, phòng ban, đơn vị", "Theo dõi tiến độ, kết quả thực hiện theo kỳ", "Tự động tính điểm và xếp loại", "Kết nối với hệ thống lương thưởng, đánh giá", "Báo cáo phân tích hiệu suất đa chiều"]					6	t	t	2026-01-10 02:59:52.987173	2026-01-13 02:49:07.917612
3	3	he-thong-csdl-quan-ly-cong-chung-chung-thuc	HỆ THỐNG CSDL QUẢN LÝ CÔNG CHỨNG, CHỨNG THỰC	Cơ sở dữ liệu công chứng tập trung, an toàn	Sản phẩm • Tin công nghệ • 16/09/2023	Giải pháp quản lý cơ sở dữ liệu công chứng, chứng thực tập trung, giúp giảm rủi ro trong các giao dịch, hỗ trợ nghiệp vụ cho các tổ chức hành nghề công chứng.	https://sfb.vn/wp-content/uploads/2023/09/C3T-318x212.png	from-orange-600 to-amber-600	Liên hệ	Cho lĩnh vực công chứng	Phòng công chứng, VP công chứng	4.8	Triển khai toàn tỉnh/thành	["Lưu trữ tập trung hợp đồng công chứng, chứng thực", "Tra cứu nhanh lịch sử giao dịch theo nhiều tiêu chí", "Cảnh báo trùng lặp, rủi ro trong giao dịch", "Phân quyền chi tiết theo vai trò nghiệp vụ", "Tích hợp chữ ký số và chứng thư số", "Báo cáo thống kê, hỗ trợ thanh tra, kiểm tra"]					3	t	t	2026-01-10 02:59:52.987173	2026-01-10 03:22:25.434181
2	2	bao-gia-san-pham-he-thong-giao-duc-thong-minh	BÁO GIÁ SẢN PHẨM - HỆ THỐNG GIÁO DỤC THÔNG MINH	Hệ sinh thái giáo dục số cho nhà trường	Sản phẩm • Tin công nghệ • 08/12/2023	Gói sản phẩm và dịch vụ cho hệ thống Giáo dục thông minh của SFB, giúp nhà trường số hóa toàn bộ hoạt động quản lý, giảng dạy và tương tác với phụ huynh, học sinh.	https://sfb.vn/wp-content/uploads/2023/12/Daiien-512x341.png	from-purple-600 to-pink-600	Theo gói triển khai	Giải pháp giáo dục	Nhiều cơ sở giáo dục triển khai	4.9	Mô hình Cloud	["Quản lý hồ sơ học sinh – giáo viên", "Quản lý học tập, điểm số, thời khóa biểu", "Cổng thông tin điện tử cho phụ huynh & học sinh", "Học bạ điện tử và sổ liên lạc điện tử", "Tích hợp học trực tuyến, bài tập online", "Báo cáo, thống kê theo năm học/kỳ học"]					2	t	t	2026-01-10 02:59:52.987173	2026-01-12 03:58:19.804271
8	4	he-thong-quan-ly-tai-lieu-luu-tru	HỆ THỐNG QUẢN LÝ TÀI LIỆU LƯU TRỮ	Quản lý văn bản hay hồ sơ, giấy tờ, các tài liệu thông tin của các cơ quan và doanh nghiệp	Sản phẩm 14/04/2020	Phần mềm quản lý tài liệu lưu trữ được sử dụng trong công tác quản lý văn bản hay hồ sơ, giấy tờ, các tài liệu thông tin của các cơ quan và doanh nghiệp, giúp giảm thiểu công tác lưu trữ giấy tờ như trước kia và bảo đảm tính bảo mật, an toàn về thông tin với các dữ liệu quan trọng.	https://beta.sfb.vn/uploads/news/11-9-2014-94531-449x300-1768014910951-156729570.png	from-[#006FB3] to-[#0088D9]	Liên hệ	Bảo đảm tính bảo mật, an toàn về thông tin với các dữ liệu quan trọng		0.0		["Phân hệ thu thập tài liệu", "Phân hệ biên mục chỉnh lý", "Phân hệ lưu thông tài liệu", "Phân hệ khai thác trực tuyến", "Phân hệ danh mục", "Phân hệ quản trị hệ thống"]					0	f	t	2026-01-10 03:15:27.373828	2026-01-13 02:32:48.868914
14	7	xay-dung-cong-thong-tin-dien-tu-cho-dang-uy-khoi-doanh-nghiep-tinh-thai-binh	XÂY DỰNG CỔNG THÔNG TIN ĐIỆN TỬ CHO ĐẢNG ỦY KHỐI DOANH NGHIỆP TỈNH THÁI BÌNH	 Truy cập mọi lúc mọi nơi trên thiết bị điện tử, cung cấp thông tin nhanh chóng		Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng. Dưới đây chúng tôi xin nêu ra những lợi ích mà website sẽ mang đến cho các cơ quan: 	https://beta.sfb.vn/uploads/news/dutb-368x245-1768269821144-331764654.png	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Khối lượng thông tin cung cấp không hạn chế như quảng cáo trên báo đài", "Công bố thông tin trên diện rộng", "Dễ dàng tìm kiếm bất cứ lúc nào, bất cứ đâu", "Tương tác giữa cơ quan và mọi người"]					0	f	t	2026-01-13 02:04:19.562657	2026-01-13 02:30:26.881752
10	4	dich-vu-quan-tri-va-van-hanh-he-thong	DỊCH VỤ QUẢN TRỊ VÀ VẬN HÀNH HỆ THỐNG	Quản trị và vận hành hệ thống một cách tối ưu	Sản phẩm * 01/06/2020	SFB hiểu được những lo âu của doanh nghiệp khi vận hành hệ thống. Liệu hệ thống có đang vận hành tối ưu? Các bản có được cập nhật đầy đủ?… SFB đem lại giải pháp quản trị và vận hành hệ thống cho doanh nghiệp với những lợi ích	https://beta.sfb.vn/uploads/news/QTHT-350x233-1768015542484-988549580.png	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		[]					0	f	t	2026-01-10 03:25:50.231627	2026-01-13 02:32:35.043866
17	4	xay-dung-he-thong-quan-ly-ly-lich-nhan-su	 XÂY DỰNG HỆ THỐNG QUẢN LÝ LÝ LỊCH NHÂN SỰ	Quản lý lý lịch,  theo dõi thông tin		Trong mỗi công ty việc quản lý lý lịch nhân sự là rất cần thiết, nhờ đó bạn có thể theo dõi thông tin nhân sự của mình. Với sự phát triển CNTT hiện nay việc tin học hóa quản lý lý lịch nhân sự sẽ giúp công ty của bạn có thể ghi lại tất cả quá trình của mỗi nhân sự khi bắt đầu bước vào công ty. Nhờ vậy mà việc quản lý sẽ trở lên đơn giản hơn rất nhiều.	https://beta.sfb.vn/uploads/news/NV-598x399-1768272751368-318624115.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Quản lý thông tin cán bộ theo Mẫu Sơ yếu lý lịch cán bộ, công chức – Mẫu 2C-BNV/2008", "Quản lý quá trình công tác", "Quản lý quá trình khen thưởng kỷ luật", "Quản lý quá trình nâng bậc nâng ngạch", "Quản lý quá trình đào tạo", "Cơ chế nhật ký (logging) ghi nhận tất cả các sự kiện (ai, làm gì, lúc nào) Chia sẻ bài viết"]					0	f	t	2026-01-13 02:53:20.669722	2026-01-13 02:54:22.591427
12	4	trang-thuong-mai-dien-su-san-pham-ngoc-linh	TRANG THƯƠNG MAI ĐIỆN SỬ SẢN PHẨM NGỌC LINH	Giúp sản phẩm ngày càng được biết đến trên diện rộng	Ngày 02/04/2020	Ngày nay công nghệ đang ngày một phát triển, vì vậy việc quản lý mọi thông tin khách hàng cũng như sản phẩm kinh doanh trên nền công nghệ thông tin là rất hữu dụng. Hiểu được điều đó Công ty Cổ phần Công nghệ SFB đã cùng với quý khách hàng phát triển website Sản phẩm Ngọc Linh. Với mục đích đưa website Sản phẩm Ngọc Linh vào sử dụng sẽ giúp khách hàng :	https://beta.sfb.vn/uploads/news/ngoc-linh-768x648-1768016781872-31751691.png	from-[#006FB3] to-[#0088D9]	Liên hệ	Tăng hiệu quả kinh doanh 		0.0		["Xây dựng và quảng bá thương hiệu", "Người sử dụng tiếp cận được nhiều khách hàng tiềm năng", "Hỗ trợ khách hàng 24/24", "Tăng hiệu quả kinh doanh", "Tăng năng lực cạnh tranh", "Tăng lợi nhuận", "Cập nhật thông tin sản phẩm một cách nhanh chóng"]					0	f	t	2026-01-10 03:42:11.61923	2026-01-13 02:30:40.306345
13	7	xay-dung-cong-thong-tin-dien-tu-cho-so-ngoai-vu-tinh-thai-binh	XÂY DỰNG CỔNG THÔNG TIN ĐIỆN TỬ CHO SỞ NGOẠI VỤ TỈNH THÁI BÌNH	Giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình		Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng. Dưới đây chúng tôi xin nêu ra những lợi ích mà website sẽ mang đến cho các cơ quan	https://beta.sfb.vn/uploads/news/cong-thong-tin-1768208280257-384299973.webp	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Khối lượng thông tin cung cấp không hạn chế như trên báo đài", "Công bố thông tin trên diện rộng", "Dễ dàng tìm kiếm bất cứ lúc nào, bất cứ đâu", "Tương tác giữa cơ quan và mọi người"]					0	f	t	2026-01-12 08:58:04.413565	2026-01-12 09:19:32.915607
16	11	dich-vu-outsourcing	DỊCH VỤ OUTSOURCING	Xu hướng nhân lực thế kỷ 21		Outsourcing là một xu hướng nhân lực thế kỷ 21. Dịch vụ outsourcing đang ngày một phát triển và chiếm ưu thế với sự xuất hiện của nhiều doanh nghiệp.	https://beta.sfb.vn/uploads/news/OURR-600x400-1768271187420-610925503.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Giảm chi phí quản lý cơ sở hạ tầng CNTT thông qua việc cải thiện năng suất và hiệu quả hoạt động", "Hỗ trợ thúc đẩy các nghiệp vụ mang lại lợi ích giúp doanh nghiệp thành công", "Hỗ trợ đối tác công nghệ tiên tiến nhất trong quá trình đảm nhiệm"]					0	f	t	2026-01-13 02:28:31.881521	2026-01-13 02:29:52.472023
15	7	xay-dung-cong-thong-tin-dien-tu-cho-so-noi-vu-tinh-thai-binh	XÂY DỰNG CỔNG THÔNG TIN ĐIỆN TỬ CHO SỞ NỘI VỤ TỈNH THÁI BÌNH	Truy cập mọi lúc mọi nơi trên thiết bị điện tử, cung cấp thông tin nhanh chóng		Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Nó cung cấp thông tin nhanh chóng, mang tính cập nhật để phục vụ tốt các đối tượng người dùng. Dưới đây chúng tôi xin nêu ra những lợi ích mà website sẽ mang đến cho các cơ quan.	https://beta.sfb.vn/uploads/news/snvtb-290x193-1768270419048-629460892.png	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Khối lượng thông tin cung cấp không hạn chế như quảng cáo trên báo đài", "Công bố thông tin trên diện rộng", "Dễ dàng tìm kiếm bất cứ lúc nào, bất cứ đâu", "Tương tác giữa cơ quan và mọi người"]					0	f	t	2026-01-13 02:16:56.929401	2026-01-13 02:30:20.646709
9	4	he-thong-quan-ly-thu-vien-so	HỆ THỐNG QUẢN LÝ THƯ VIỆN SỐ	Các nội dung kỹ thuật số có thể được lưu trữ cục bộ, hoặc truy cập từ xa thông qua mạng máy tính	Sản phẩm 13/04/2020	Thư viện số hay thư viện trực tuyến là thư viện mà ở đó các bộ sưu tập các văn bản, tài liệu hình ảnh, tài liệu âm thanh, tài liệu video được lưu trữ dưới dạng số (tương phản với các định dạng in, vi dạng, hoặc các phương tiện khác) cùng với các phương tiện để tổ chức, lưu trữ và truy cập các tài liệu dưới dạng tập tin trong bộ sưu tập của thư viện. Thư viện kỹ thuật số có thể khác nhau rất nhiều về kích thước và phạm vi, và có thể được duy trì bởi các cá nhân, tổ chức hoặc là một phần được mới thành lập từ các thư viện thông thường hoặc các viện, hoặc với các tổ chức học thuật. Các nội dung kỹ thuật số có thể được lưu trữ cục bộ, hoặc truy cập từ xa thông qua mạng máy tính. Một thư viện điện tử là một loại hệ thống thông tin. Thư viện số là một loại hệ thống truy hồi thông tin.\n\n	https://beta.sfb.vn/uploads/news/h--nh----nh-b--a-5-768x512-1768015480158-343225747.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ	Lưu trữ cục bộ, truy cập thông tin từ xa		0.0		["Phân hệ quản lý tài nguyên số", "Phân hệ quản lý cán bộ khai thác", "Phân hệ lưu thông", "Phân hệ khai thác trực tuyến", "Phân hệ danh mụ", "Phân hệ quản trị hệ thống"]					0	f	t	2026-01-10 03:25:45.465062	2026-01-13 02:32:43.0022
7	4	phan-mem-quan-ly-thi-dua-khen-thuong	PHẦN MỀM QUẢN LÝ THI ĐUA KHEN THƯỞNG	Hỗ trợ các công việc trong quản lý khen thưởng, giảm đi gánh nặng, áp lực công việc trong công tác quản lý hành chính	Sản phẩm 14/04/2020	Phần mềm quản lý thi đua khen thưởng là công cụ hữu ích giúp các doanh nghiệp, công ty theo dõi được quá trình khen thưởng cá nhân, nhóm, tập thể tránh việc bỏ sót những cá nhân, tập thể xuất sắc.	https://beta.sfb.vn/uploads/news/Thi---ua-khen-th-----ng-1768014187507-494465171.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ	Hỗ trợ quản lý thi đua, khen thưởng		0.0		["Quản lý dữ liệu đảng viên", "Quản lý thi đua khen thưởng kỷ luật", "Tra cứu và khai thác dữ liệu", "Cảnh báo dữ liệu", "Danh mục hệ thống", "Quản trị hệ thống"]					0	f	t	2026-01-10 03:03:11.746681	2026-01-13 02:33:01.027236
18	12	xay-dung-he-thong-quan-ly-ly-lich-khoa-hoc	XÂY DỰNG HỆ THỐNG QUẢN LÝ LÝ LỊCH KHOA HỌC	Quản lý thông tin lý lịch		Tính năng nổi bật	https://beta.sfb.vn/uploads/news/QUANLY-1768273119096-280599426.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Quản lý lý lịch khoa học", "Tra cứu thông tin lý lịch khoa học", "Báo cáo – Thống kê", "Phân hệ trực tuyến", "Phân hệ danh mục", "Phân hệ quản trị hệ thống"]					0	f	t	2026-01-13 03:01:52.78377	2026-01-13 03:06:43.988178
19	7	xay-dung-cong-thong-tin-dien-tu-cho-dai-khi-tuong-thuy-van-tinh-thai-binh	XÂY DỰNG CỔNG THÔNG TIN ĐIỆN TỬ CHO ĐÀI KHÍ TƯỢNG THỦY VĂN TỈNH THÁI BÌNH	Truy cập mọi lúc mọi nơi trên thiết bị điện tử		Website là một công cụ giúp mọi người dùng có thể truy cập mọi lúc mọi nơi trên thiết bị điện tử của mình. Sử dụng website để theo dõi dự báo thời tiết cũng là một ý tưởng sáng tạo mà SFB đã cùng với Trung tâm Khí tượng Thủy Văn Thái Bình tạo và xây dựng website.	https://beta.sfb.vn/uploads/news/kttv-504x336-1768273742113-126286162.png	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		[]					0	f	t	2026-01-13 03:09:11.515444	2026-01-13 03:10:04.329506
21	11	dich-vu	 DỊCH VỤ	Cung cấp dịch vụ Tư vấn xây dựng chiến lược CNTT cho các Doanh nghiệp, Cơ quan, Tổ chức nhằm hỗ trợ Doanh nghiệp, Cơ quan, Tổ chức xây dựng được một hệ thống CNTT mang tính tổng thể và thống nhất		Với đội ngũ chuyên gia nhiều kinh nghiệm, với quan hệ đối tác với các hãng hàng đầu về CNTT trên thế giới, SFB đem lại cho khách hàng các dịch vụ chuyên nghiệp về tích hợp hệ thống như:	https://beta.sfb.vn/uploads/news/h--nh----nh-b--a-1-649x433-1768277288909-286994143.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Giải pháp về hệ thống máy chủ – lưu trữ", "Giải pháp cơ sở dữ liệu", "Giải pháp mạng và truyền thông hợp nhất", "Giải pháp và dịch vụ an toàn, bảo mật thông tin"]					0	f	t	2026-01-13 04:08:10.477758	2026-01-13 04:22:26.575169
20	2	xay-dung-trang-thuong-mai-dien-tu-thiet-bi-truong-hoc-ngoc-anh	XÂY DỰNG TRANG THƯƠNG MẠI ĐIỆN TỬ THIẾT BỊ TRƯỜNG HỌC NGỌC ANH	Quản lý mọi thông tin khách hàng		Ngày nay công nghệ đang ngày một phát triển, vì vậy việc quản lý mọi thông tin khách hàng cũng như sản phẩm kinh doanh trên nền công nghệ thông tin là rất hữu dụng. Hiểu được điều đó Công ty SFB đã cùng với quý khách hàng phát triển website Thiết bị trường học Ngọc Anh. Với mục đích đưa website Thiết bị trường học Ngọc Anh vào sử dụng sẽ giúp khách hàng :	https://beta.sfb.vn/uploads/news/tb-640x426-1768274204386-73764303.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Xây dựng và quảng bá thương hiệu", "Người sử dụng tiếp cận được nhiều khách hàng tiềm năng", "Hỗ trợ khách hàng 24/24", "Tăng hiệu quả kinh doanh", "Tăng năng lực cạnh tranh", "Tăng lợi nhuận", "Cập nhật thông tin sản phẩm một cách nhanh chóng"]					0	f	t	2026-01-13 03:49:28.383699	2026-01-13 04:03:07.539878
22	13	he-thong-giai-phap-xay-dung-theo-yeu-cau-khach-hang	Hệ thống giải pháp xây dựng theo yêu cầu khách hàng	Tham gia tư vấn, phân tích, khảo sát nghiệp vụ và công nghệ thông tin hóa hỗ trợ tối ưu quy trình nghiệp vụ của khách hàng		Các công nghệ đáp ứng:	https://beta.sfb.vn/uploads/news/kpi-500x333-1--1--1768288949262-317616730.png	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Programming Languages", "Application Servers", "Mark-up and Scripting Technologies", "Operating Systems", "Relational Database Management Systems (RDBMS)", "Integrated Development Environments (IDE)"]					0	f	t	2026-01-13 07:23:16.795475	2026-01-13 07:30:05.535933
23	13	microsoft-lync-server	MICROSOFT LYNC SERVER	Giải pháp thay thế các phương tiện giao tiếp truyền thống trong doanh nghiệp		Là giải pháp thay thế các phương tiện giao tiếp truyền thống trong doanh nghiệp, Microsoft Lync giúp liên kết người dùng mọi nơi và mọi lúc thông qua việc kết nối các thiết bị truyền thông thông dụng của người dùng như máy tính, điện thoại bàn, điện thoại di động và trình duyệt web trong một nền tảng giao tiếp duy nhất.	https://beta.sfb.vn/uploads/news/nhung-hinh-nen-ve-cong-nghe-thong-tin-dep-cho-powerpoint-anh-10-768x512-1768289483003-399539213.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		[]					0	f	t	2026-01-13 07:40:44.02657	2026-01-13 07:44:46.554296
24	14	he-thong-email-dien-tu	Hệ thống email điện tử	Phần mềm máy chủ do Microsoft phát triển chuyên phục vụ các giải pháp e-mail và trao đổi thông tin trong doanh nghiệp		Microsoft Exchange Exchange Server là phần mềm máy chủ do Microsoft phát triển chuyên phục vụ các giải pháp e-mail và trao đổi thông tin trong doanh nghiệp. Tiếp nối thành công của những phiên bản trước, Microsoft đã chính thức ra mắt phiên bản Exchange Server 2016. Phiên bản này giúp đơn giản hóa công việc quản lý, bảo vệ thông tin liên lạc và đặc biệt là đáp ứng nhu cầu của doanh nghiệp trong việc đồng bộ hóa các thiết bị di động.	https://beta.sfb.vn/uploads/news/0c71b9b5-94e8-464c-849f-8350258ec8f6-487x324-1768290769134-497253284.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		[]					0	f	t	2026-01-13 07:52:52.47687	2026-01-13 07:53:59.079393
25	14	he-thong-truc-tich-hop-va-trao-doi-ibm	Hệ thống trục tích hợp và trao đổi IBM	Kết nối mọi ứng dụng với nhau, chuyển đổi khuân dạng dữ liệu giữa các ứng dụng,..		Tính năng nội bật:	https://beta.sfb.vn/uploads/news/s0051-768x512-1768291112668-37842684.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Kết nối mọi ứng dụng với nhau", "Chuyển đổi khuân dạng dữ liệu giữa các ứng dụng", "Chuyển đổi các giao thức kết nối đa dạng", "Phân phối các thành phần nghiệp vụ", "Định tuyến các kết nối theo nhu cầu"]					0	f	t	2026-01-13 07:58:55.353677	2026-01-13 08:02:54.913803
26	12	phan-mem-quan-ly-nghien-cuu-khoa-hoc	Phần mềm quản lý nghiên cứu khoa học	Giúp các cơ quan, doanh nghiệp lưu trữ và phân loại các đề tài nghiên cứu khoa học, công nghệ theo danh mục		Phần mềm quản lý đề tài nghiên cứu khoa học và công nghệ SFB có chức năng giúp các cơ quan, doanh nghiệp lưu trữ và phân loại các đề tài nghiên cứu khoa học, công nghệ theo danh mục để tra cứu dễ dàng, với phần mềm quản lý đề tài nghiên cứu khoa học và công nghệ SFB các cơ quan, doanh nghiệp sẽ lưu lại được tài liệu cực kỳ quan trọng phục vụ cho mục đích tham khảo nghiên cứu và ứng dụng vào thực tiễn.	https://beta.sfb.vn/uploads/news/Nghi--n-c---u-khoa-h---c-675x450-1768291679767-621663774.jpg	from-[#006FB3] to-[#0088D9]	Liên hệ			0.0		["Phân hệ Quản lý lý lịch khoa học", "Phân hệ Tìm kiếm dữ liệu", "Phân hệ Báo cáo – Thống kê", "Phân hệ Trang đăng ký", "Phân hệ Đăng ký và nhắc việc nghiên cứu khoa học", "Phân hệ Tìm kiếm và tra cứu trùng dữ liệu toàn văn", "Phân hệ Danh mục hệ thống", "Phân hệ Quản trị hệ thống"]					0	f	t	2026-01-13 08:08:51.185137	2026-01-13 08:10:17.593855
\.


--
-- TOC entry 3946 (class 0 OID 20396)
-- Dependencies: 241
-- Data for Name: products_section_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_section_items (id, section_id, product_detail_id, section_type, data, sort_order, is_active, created_at, updated_at) FROM stdin;
1	3	\N	benefits	{"icon": "/icons/custom/product1.svg", "title": "Bảo mật cao", "gradient": "from-[#006FB3] to-[#0088D9]", "description": "Tuân thủ chuẩn bảo mật, mã hóa dữ liệu end-to-end."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	3	\N	benefits	{"icon": "/icons/custom/product2.svg", "title": "Hiệu năng ổn định", "gradient": "from-[#FF81C2] to-[#667EEA]", "description": "Hệ thống tối ưu, uptime cao, đáp ứng nhu cầu vận hành."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	3	\N	benefits	{"icon": "/icons/custom/product3.svg", "title": "Dễ triển khai & sử dụng", "gradient": "from-[#2AF598] to-[#009EFD]", "description": "Giao diện trực quan, đào tạo & hỗ trợ cho người dùng."}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	3	\N	benefits	{"icon": "/icons/custom/product4.svg", "title": "Sẵn sàng mở rộng", "gradient": "from-[#FA709A] to-[#FEE140]", "description": "Kiến trúc linh hoạt, dễ tích hợp và mở rộng về sau."}	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
16	\N	1	section-paragraphs	{"section_no": 1, "paragraph_text": "Người dùng có thể quản lý học sinh theo khối, lớp, khu vực, giới tính nhằm phục vụ công tác quản lý, tuyển sinh sau này hoặc công tác phân bổ học sinh, giáo viên trên địa bàn."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
17	\N	1	section-paragraphs	{"section_no": 1, "paragraph_text": "Hệ thống cung cấp các tính năng trong việc phân chia lớp, xếp môn cho lớp. Việc phân môn chính xác giúp tính toán điểm và tổng kết đơn giản và dễ dàng hơn."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
18	\N	1	section-paragraphs	{"section_no": 1, "paragraph_text": "Hệ thống quản lý tất cả thông tin của nhân sự theo từng trường, từng nhóm bộ môn. Dữ liệu quản lý có thể phục vụ cho việc thống kê, in báo cáo cho Ban giám hiệu nhà trường."}	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
19	\N	1	section-paragraphs	{"section_no": 2, "paragraph_text": "Hệ thống căn cứ trên các thông tư được ban hành để xây dựng nên sổ dữ liệu tính điểm cho trường."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
20	\N	1	section-paragraphs	{"section_no": 2, "paragraph_text": "Thiết kế giao diện đơn giản cùng các tiện ích tìm kiếm phục vụ cho công tác tính điểm của giáo viên và công tác quản lý của ban giám hiệu nhà trường."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
21	\N	1	section-paragraphs	{"section_no": 4, "paragraph_text": "Phần mềm cung cấp các chức năng báo cáo thống kê trên tất cả dữ liệu quản lý trong nhà trường."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
22	\N	1	section-paragraphs	{"section_no": 5, "paragraph_text": "Ngoài việc quản lý thông tin, kết quả học tập, phần mềm phát triển các tính năng phục vụ cho việc lưu trữ/nhắc các sổ sách trong việc quản lý nhà trường."}	0	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
23	\N	1	section-paragraphs	{"section_no": 5, "paragraph_text": "Thông tin các sổ sách được dựa theo thông tư đã ban hành và ý kiến trao đổi với phía nhà trường."}	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
29	\N	1	overview-cards	{"step": 1, "title": "Quản lý thông tin", "description": "Người dùng có thể quản lý các thông tin như nhân sự, lớp học, học sinh."}	0	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
30	\N	1	overview-cards	{"step": 2, "title": "Nhập liệu", "description": "Chức năng cho phép giáo viên thực hiện nhập điểm và theo dõi học sinh."}	1	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
31	\N	1	overview-cards	{"step": 3, "title": "Tổng kết", "description": "Là chức năng tổng hợp kết quả học tập theo năm của toàn trường."}	2	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
32	\N	1	overview-cards	{"step": 4, "title": "Báo cáo", "description": "Cấp các chức năng báo cáo thống kê trên tất cả dữ liệu quản lý trong nhà trường."}	3	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
33	\N	1	overview-cards	{"step": 5, "title": "Sổ sách", "description": "Quản lý các loại sổ sách của giáo viên, học sinh theo các mẫu đang sử dụng hiện hành trong trường."}	4	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
34	\N	1	showcase-bullets	{"bullet_text": "Nắm bắt nhanh yêu cầu nghiệp vụ"}	0	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
35	\N	1	showcase-bullets	{"bullet_text": "Giải pháp \\"fit\\" quy trình, không one-size-fits-all"}	1	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
36	\N	1	numbered-sections	{"image": "/images/products/tuyen-sinh-dau-cap/section-1.png", "title": "Quản lý thông tin nhân sự, học sinh, lớp học", "image_alt": "Section 1", "image_side": "right", "section_no": 1, "overlay_back_image": "/images/products/tuyen-sinh-dau-cap/section-1.png", "overlay_front_image": "/images/products/tuyen-sinh-dau-cap/section-1.png"}	0	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
37	\N	1	numbered-sections	{"image": "/images/products/tuyen-sinh-dau-cap/section-2.png", "title": "Chức năng nhập liệu", "image_alt": "Section 2", "image_side": "left", "section_no": 2, "overlay_back_image": "/images/products/tuyen-sinh-dau-cap/section-2.png", "overlay_front_image": ""}	1	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
38	\N	1	numbered-sections	{"image": "/images/products/tuyen-sinh-dau-cap/section-4.png", "title": "Thống kê báo cáo", "image_alt": "Section 4", "image_side": "right", "section_no": 4, "overlay_back_image": "/images/products/tuyen-sinh-dau-cap/section-4.png", "overlay_front_image": "/images/products/tuyen-sinh-dau-cap/section-4.png"}	2	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
39	\N	1	numbered-sections	{"image": "/images/products/tuyen-sinh-dau-cap/section-5.png", "title": "Sổ sách", "image_alt": "Section 5", "image_side": "left", "section_no": 5, "overlay_back_image": "/images/products/tuyen-sinh-dau-cap/section-5.png", "overlay_front_image": "/images/products/tuyen-sinh-dau-cap/section-5.png"}	3	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
40	\N	1	expand-bullets	{"bullet_text": "Tích hợp các hệ thống dùng chung"}	0	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
41	\N	1	expand-bullets	{"bullet_text": "Cập nhật liên tục các tiện ích, tính năng"}	1	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
42	\N	1	expand-bullets	{"bullet_text": "Hỗ trợ tận tình trong quá trình sử dụng"}	2	t	2026-01-10 04:44:26.504616	2026-01-10 04:44:26.504616
\.


--
-- TOC entry 3944 (class 0 OID 20377)
-- Dependencies: 239
-- Data for Name: products_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_sections (id, section_type, data, is_active, created_at, updated_at) FROM stdin;
1	hero	{"title": "Bộ giải pháp phần mềm", "subtitle": "Phục vụ Giáo dục, Công chứng & Doanh nghiệp", "stat1Label": "Giải pháp phần mềm", "stat1Value": "+32.000", "stat2Label": "Đơn vị triển khai thực tế", "stat2Value": "+6.000", "stat3Label": "Mức độ hài lòng trung bình", "stat3Value": "4.9★", "description": "Các sản phẩm SFB được xây dựng từ bài toán thực tế của cơ quan Nhà nước, nhà trường và doanh nghiệp, giúp tối ưu quy trình và nâng cao hiệu quả quản lý.", "primaryCtaLink": "#products", "primaryCtaText": "Xem danh sách sản phẩm", "secondaryCtaLink": "/contact", "secondaryCtaText": "Tư vấn giải pháp", "backgroundGradient": "linear-gradient(to bottom right, #0870B4, #2EABE2)"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	list-header	{"title": "Sản phẩm & giải pháp nổi bật", "subtitle": "GIẢI PHÁP CHUYÊN NGHIỆP", "description": "Danh sách các hệ thống phần mềm đang được SFB triển khai cho nhà trường, cơ quan Nhà nước và doanh nghiệp."}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	benefits	{}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	cta	{"title": "Miễn phí tư vấn", "description": "Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình chuyển đổi số.", "backgroundColor": "#29A3DD", "primaryButtonLink": "/contact", "primaryButtonText": "Tư vấn miễn phí ngay", "secondaryButtonLink": "/solutions", "secondaryButtonText": "Xem case studies"}	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3927 (class 0 OID 20165)
-- Dependencies: 222
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, role_id, permission_id, created_at) FROM stdin;
1	1	1	2026-01-10 02:59:52.987173
2	1	2	2026-01-10 02:59:52.987173
3	1	3	2026-01-10 02:59:52.987173
4	1	4	2026-01-10 02:59:52.987173
5	1	5	2026-01-10 02:59:52.987173
6	1	6	2026-01-10 02:59:52.987173
7	1	7	2026-01-10 02:59:52.987173
8	1	8	2026-01-10 02:59:52.987173
9	1	9	2026-01-10 02:59:52.987173
10	1	10	2026-01-10 02:59:52.987173
11	1	11	2026-01-10 02:59:52.987173
12	1	12	2026-01-10 02:59:52.987173
13	1	13	2026-01-10 02:59:52.987173
14	1	14	2026-01-10 02:59:52.987173
15	1	15	2026-01-10 02:59:52.987173
16	1	16	2026-01-10 02:59:52.987173
17	1	17	2026-01-10 02:59:52.987173
18	2	1	2026-01-10 02:59:52.987173
19	2	8	2026-01-10 02:59:52.987173
20	2	9	2026-01-10 02:59:52.987173
21	2	10	2026-01-10 02:59:52.987173
22	2	11	2026-01-10 02:59:52.987173
23	2	14	2026-01-10 02:59:52.987173
24	2	16	2026-01-10 02:59:52.987173
25	2	17	2026-01-10 02:59:52.987173
28	3	1	2026-01-10 02:59:52.987173
29	1	18	2026-01-10 02:59:52.987173
30	1	19	2026-01-10 02:59:52.987173
31	1	20	2026-01-10 02:59:52.987173
32	1	21	2026-01-10 02:59:52.987173
33	1	22	2026-01-10 02:59:52.987173
34	1	23	2026-01-10 02:59:52.987173
35	2	18	2026-01-10 02:59:52.987173
36	2	19	2026-01-10 02:59:52.987173
37	2	20	2026-01-10 02:59:52.987173
38	2	21	2026-01-10 02:59:52.987173
39	1	24	2026-01-10 02:59:52.987173
40	1	25	2026-01-10 02:59:52.987173
41	1	26	2026-01-10 02:59:52.987173
42	1	27	2026-01-10 02:59:52.987173
43	1	28	2026-01-10 02:59:52.987173
44	1	29	2026-01-10 02:59:52.987173
45	1	30	2026-01-10 02:59:52.987173
46	1	31	2026-01-10 02:59:52.987173
47	1	32	2026-01-10 02:59:52.987173
48	1	33	2026-01-10 02:59:52.987173
49	1	34	2026-01-10 02:59:52.987173
50	1	35	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3921 (class 0 OID 20107)
-- Dependencies: 216
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, code, name, description, is_active, is_default, created_at, updated_at) FROM stdin;
1	admin	Quản trị viên	Toàn quyền hệ thống	t	f	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	editor	Biên tập viên	Quản lý nội dung	t	f	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	user	Người dùng	Quyền mặc định	t	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3972 (class 0 OID 20675)
-- Dependencies: 267
-- Data for Name: seo_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seo_pages (id, page_path, page_type, title, description, keywords, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image, canonical_url, robots_index, robots_follow, robots_noarchive, robots_nosnippet, structured_data, created_at, updated_at) FROM stdin;
1	/	home	SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam	SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số với các giải pháp công nghệ tiên tiến	SFB Technology, giải pháp công nghệ, chuyển đổi số, phần mềm Việt Nam	SFB Technology - Giải pháp công nghệ hàng đầu Việt Nam	SFB Technology đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số	\N	website	summary_large_image	\N	\N	\N	https://sfb.vn/	t	t	f	f	\N	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	/products	products	Sản phẩm & Giải pháp - SFB Technology	Khám phá các sản phẩm và giải pháp công nghệ của SFB Technology	sản phẩm, giải pháp, phần mềm, công nghệ	Sản phẩm & Giải pháp - SFB Technology	Khám phá các sản phẩm và giải pháp công nghệ của SFB Technology	\N	website	summary_large_image	\N	\N	\N	https://sfb.vn/products	t	t	f	f	\N	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	/about	about	Về chúng tôi - SFB Technology	Tìm hiểu về SFB Technology - Công ty công nghệ hàng đầu Việt Nam	về chúng tôi, SFB Technology, công ty công nghệ	Về chúng tôi - SFB Technology	Tìm hiểu về SFB Technology - Công ty công nghệ hàng đầu Việt Nam	\N	website	summary_large_image	\N	\N	\N	https://sfb.vn/about	t	t	f	f	\N	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	/contact	contact	Liên hệ - SFB Technology	Liên hệ với SFB Technology để được tư vấn về các giải pháp công nghệ	liên hệ, tư vấn, SFB Technology	Liên hệ - SFB Technology	Liên hệ với SFB Technology để được tư vấn về các giải pháp công nghệ	\N	website	summary_large_image	\N	\N	\N	https://sfb.vn/contact	t	t	f	f	\N	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	/news	news	Tin tức - SFB Technology	Cập nhật tin tức mới nhất về công nghệ, sản phẩm và hoạt động của SFB Technology	tin tức, công nghệ, SFB Technology	Tin tức - SFB Technology	Cập nhật tin tức mới nhất về công nghệ, sản phẩm và hoạt động của SFB Technology	\N	website	summary_large_image	\N	\N	\N	https://sfb.vn/news	t	t	f	f	\N	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
6	/industries	industries	Lĩnh vực - SFB Technology	Khám phá các lĩnh vực ứng dụng của SFB Technology	lĩnh vực, ứng dụng, SFB Technology	Lĩnh vực - SFB Technology	Khám phá các lĩnh vực ứng dụng của SFB Technology	\N	website	summary_large_image	\N	\N	\N	https://sfb.vn/industries	t	t	f	f	\N	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
7	/careers	careers	Tuyển dụng - SFB Technology	Cơ hội nghề nghiệp tại SFB Technology	tuyển dụng, nghề nghiệp, SFB Technology	Tuyển dụng - SFB Technology	Cơ hội nghề nghiệp tại SFB Technology	\N	website	summary_large_image	\N	\N	\N	https://sfb.vn/careers	t	t	f	f	\N	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 3974 (class 0 OID 20698)
-- Dependencies: 269
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, setting_key, setting_value, setting_type, description, category, created_at, updated_at) FROM stdin;
13	footer_quick_links	[{"name":"Trang chủ","href":"/"},{"name":"Giới thiệu SFB","href":"/about"},{"name":"Sản phẩm – Dịch vụ","href":"/solutions"},{"name":"Tuyển dụng","href":"/careers"},{"name":"Tin tức","href":"/news"},{"name":"Liên hệ","href":"/contact"}]	json	Danh sách liên kết nhanh trong footer (JSON array)	footer	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
14	footer_solutions	[{"name":"Tư vấn xây dựng và phát triển hệ thống","href":"/solutions"},{"name":"Cung cấp dịch vụ quản trị hệ thống","href":"/solutions"},{"name":"Thiết kế & xây dựng giải pháp cổng TTĐT","href":"/solutions"},{"name":"Cổng thông tin Chính phủ điện tử SharePoint","href":"/solutions"},{"name":"Outsourcing","href":"/solutions"},{"name":"Data Universal Numbering System","href":"/solutions"}]	json	Danh sách dịch vụ trong footer (JSON array)	footer	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
15	google_site_verification	nskAzb2wgDby-HUyaAmxjuyMNgkQ1Z-GSbTs-Tx1RJw	text	\N	general	2026-01-10 03:10:29.532027	2026-01-12 02:36:51.136707
1	favicon	https://beta.sfb.vn/uploads/news/logo-2-1768014621081-694292265.png	image	Favicon của website	general	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
2	logo	https://beta.sfb.vn/uploads/news/logo-2-1768184063499-496393802.png	image	Logo chính của website	general	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
3	slogan	Smart Solutions Business	text	Slogan của công ty	general	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
4	site_name	SFB	text	Tên website	general	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
5	site_description	SFB có một đội ngũ chuyên gia CNTT trẻ, có kiến thức chuyên sâu về Công nghệ Thông tin, Phát triển Web và phát triển phần mềm ứng dụng.	text	Mô tả website (hiển thị trong footer)	general	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
6	phone	0888 917 999	text	Số điện thoại liên hệ	contact	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
7	email	info@sfb.vn	text	Email liên hệ	contact	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
8	address	P303, Tầng 3, Khách sạn Thể thao, Số 15 Lê Văn Thiêm, P. Nhân Chính, Q. Thanh Xuân, Hà Nội.	text	Địa chỉ văn phòng	contact	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
9	social_facebook	https://www.facebook.com	url	Link Facebook	social	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
10	social_twitter	https://twitter.com	url	Link Twitter	social	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
11	social_linkedin	https://www.linkedin.com	url	Link LinkedIn	social	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
12	social_instagram	https://www.instagram.com	url	Link Instagram	social	2026-01-10 02:59:52.987173	2026-01-12 02:36:51.136707
\.


--
-- TOC entry 3948 (class 0 OID 20428)
-- Dependencies: 243
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.testimonials (id, quote, author, company, rating, sort_order, is_active, created_at, updated_at) FROM stdin;
1	Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.	Ông Nguyễn Hoàng Chinh	\N	5	1	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
2	Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.	Ông Vũ Kim Trung	\N	5	2	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
3	Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.	Ông Nguyễn Khánh Tùng	\N	5	3	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
4	SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.	Ông Nguyễn Khanh	\N	5	4	t	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
5	Nhiều năm sử dụng phần mềm từ SFB, phần mềm đã đồng hành cùng chúng tôi đạt được nhiều thành công. Chúng tôi phát triển một phần nhờ phần mềm của các bạn, thì đương nhiên chúng tôi sẽ luôn luôn ủng hộ các bạn.	Ông Nguyễn Hoàng Chinh	\N	5	1	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
6	Chất lượng sản phẩm và dịch vụ của các bạn luôn đáp ứng được những yêu cầu, mong mỏi từ phía khoso.vn. Có đôi điều để tôi nhận xét về SFB, đó là: chuyên nghiệp, trách nhiệm, tận tình và ham học hỏi.	Ông Vũ Kim Trung	\N	5	2	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
7	Cám ơn các bạn SFB đã dành nhiều tâm sức cho việc triển khai các dự án tại Nam Việt và được các đối tác của Nam Việt đánh giá rất cao. Đây là một trong những đối tác công nghệ chúng tôi tin tưởng nhất.	Ông Nguyễn Khánh Tùng	\N	5	3	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
8	SFB không chỉ cung cấp giải pháp phần mềm mà còn là người bạn đồng hành tin cậy. Sự hỗ trợ nhiệt tình và chuyên môn cao của đội ngũ kỹ thuật giúp chúng tôi yên tâm vận hành hệ thống 24/7.	Ông Nguyễn Khanh	\N	5	4	t	2026-01-13 14:36:20.774061	2026-01-13 14:36:20.774061
\.


--
-- TOC entry 3923 (class 0 OID 20124)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, name, role_id, status, created_at, updated_at) FROM stdin;
1	admin@sfb.local	$2b$10$J6ePXVfM.f99Lhtpm0vT6.fsGrznheZFzklihxadYerXLAYRIqZh2	Admin SFB	1	active	2026-01-10 02:59:52.987173	2026-01-10 02:59:52.987173
\.


--
-- TOC entry 4008 (class 0 OID 0)
-- Dependencies: 252
-- Name: about_section_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.about_section_items_id_seq', 25, true);


--
-- TOC entry 4009 (class 0 OID 0)
-- Dependencies: 250
-- Name: about_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.about_sections_id_seq', 12, true);


--
-- TOC entry 4010 (class 0 OID 0)
-- Dependencies: 256
-- Name: career_section_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_section_items_id_seq', 12, true);


--
-- TOC entry 4011 (class 0 OID 0)
-- Dependencies: 254
-- Name: career_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_sections_id_seq', 8, true);


--
-- TOC entry 4012 (class 0 OID 0)
-- Dependencies: 264
-- Name: contact_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_requests_id_seq', 1, false);


--
-- TOC entry 4013 (class 0 OID 0)
-- Dependencies: 262
-- Name: contact_section_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_section_items_id_seq', 14, true);


--
-- TOC entry 4014 (class 0 OID 0)
-- Dependencies: 260
-- Name: contact_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_sections_id_seq', 10, true);


--
-- TOC entry 4015 (class 0 OID 0)
-- Dependencies: 258
-- Name: homepage_blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.homepage_blocks_id_seq', 14, true);


--
-- TOC entry 4016 (class 0 OID 0)
-- Dependencies: 244
-- Name: industries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.industries_id_seq', 12, true);


--
-- TOC entry 4017 (class 0 OID 0)
-- Dependencies: 248
-- Name: industries_section_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.industries_section_items_id_seq', 18, true);


--
-- TOC entry 4018 (class 0 OID 0)
-- Dependencies: 246
-- Name: industries_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.industries_sections_id_seq', 8, true);


--
-- TOC entry 4019 (class 0 OID 0)
-- Dependencies: 230
-- Name: media_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_files_id_seq', 6, true);


--
-- TOC entry 4020 (class 0 OID 0)
-- Dependencies: 228
-- Name: media_folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_folders_id_seq', 45, true);


--
-- TOC entry 4021 (class 0 OID 0)
-- Dependencies: 226
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menus_id_seq', 13, true);


--
-- TOC entry 4022 (class 0 OID 0)
-- Dependencies: 224
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 33, true);


--
-- TOC entry 4023 (class 0 OID 0)
-- Dependencies: 219
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 70, true);


--
-- TOC entry 4024 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_categories_id_seq', 19, true);


--
-- TOC entry 4025 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_details_id_seq', 26, true);


--
-- TOC entry 4026 (class 0 OID 0)
-- Dependencies: 234
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 32, true);


--
-- TOC entry 4027 (class 0 OID 0)
-- Dependencies: 240
-- Name: products_section_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_section_items_id_seq', 42, true);


--
-- TOC entry 4028 (class 0 OID 0)
-- Dependencies: 238
-- Name: products_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_sections_id_seq', 8, true);


--
-- TOC entry 4029 (class 0 OID 0)
-- Dependencies: 221
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 118, true);


--
-- TOC entry 4030 (class 0 OID 0)
-- Dependencies: 215
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- TOC entry 4031 (class 0 OID 0)
-- Dependencies: 266
-- Name: seo_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seo_pages_id_seq', 14, true);


--
-- TOC entry 4032 (class 0 OID 0)
-- Dependencies: 268
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 29, true);


--
-- TOC entry 4033 (class 0 OID 0)
-- Dependencies: 242
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 8, true);


--
-- TOC entry 4034 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 3677 (class 2606 OID 20538)
-- Name: about_section_items about_section_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_section_items
    ADD CONSTRAINT about_section_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3670 (class 2606 OID 20518)
-- Name: about_sections about_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_sections
    ADD CONSTRAINT about_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3672 (class 2606 OID 20520)
-- Name: about_sections about_sections_section_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_sections
    ADD CONSTRAINT about_sections_section_type_key UNIQUE (section_type);


--
-- TOC entry 3691 (class 2606 OID 20582)
-- Name: career_section_items career_section_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_section_items
    ADD CONSTRAINT career_section_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3684 (class 2606 OID 20562)
-- Name: career_sections career_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_sections
    ADD CONSTRAINT career_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3686 (class 2606 OID 20564)
-- Name: career_sections career_sections_section_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_sections
    ADD CONSTRAINT career_sections_section_type_key UNIQUE (section_type);


--
-- TOC entry 3719 (class 2606 OID 20669)
-- Name: contact_requests contact_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_requests
    ADD CONSTRAINT contact_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3712 (class 2606 OID 20645)
-- Name: contact_section_items contact_section_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_section_items
    ADD CONSTRAINT contact_section_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3705 (class 2606 OID 20625)
-- Name: contact_sections contact_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_sections
    ADD CONSTRAINT contact_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3707 (class 2606 OID 20627)
-- Name: contact_sections contact_sections_section_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_sections
    ADD CONSTRAINT contact_sections_section_type_key UNIQUE (section_type);


--
-- TOC entry 3698 (class 2606 OID 20606)
-- Name: homepage_blocks homepage_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homepage_blocks
    ADD CONSTRAINT homepage_blocks_pkey PRIMARY KEY (id);


--
-- TOC entry 3700 (class 2606 OID 20608)
-- Name: homepage_blocks homepage_blocks_section_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homepage_blocks
    ADD CONSTRAINT homepage_blocks_section_type_key UNIQUE (section_type);


--
-- TOC entry 3654 (class 2606 OID 20458)
-- Name: industries industries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- TOC entry 3668 (class 2606 OID 20494)
-- Name: industries_section_items industries_section_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries_section_items
    ADD CONSTRAINT industries_section_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3659 (class 2606 OID 20474)
-- Name: industries_sections industries_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries_sections
    ADD CONSTRAINT industries_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3661 (class 2606 OID 20476)
-- Name: industries_sections industries_sections_section_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries_sections
    ADD CONSTRAINT industries_sections_section_type_key UNIQUE (section_type);


--
-- TOC entry 3605 (class 2606 OID 20285)
-- Name: media_files media_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3597 (class 2606 OID 20264)
-- Name: media_folders media_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_folders
    ADD CONSTRAINT media_folders_pkey PRIMARY KEY (id);


--
-- TOC entry 3599 (class 2606 OID 20266)
-- Name: media_folders media_folders_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_folders
    ADD CONSTRAINT media_folders_slug_key UNIQUE (slug);


--
-- TOC entry 3593 (class 2606 OID 20245)
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- TOC entry 3581 (class 2606 OID 20195)
-- Name: news_categories news_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_pkey PRIMARY KEY (code);


--
-- TOC entry 3587 (class 2606 OID 20220)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- TOC entry 3589 (class 2606 OID 20222)
-- Name: news news_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_key UNIQUE (slug);


--
-- TOC entry 3570 (class 2606 OID 20160)
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- TOC entry 3572 (class 2606 OID 20158)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3610 (class 2606 OID 20311)
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3612 (class 2606 OID 20313)
-- Name: product_categories product_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_slug_key UNIQUE (slug);


--
-- TOC entry 3627 (class 2606 OID 20363)
-- Name: product_details product_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_details
    ADD CONSTRAINT product_details_pkey PRIMARY KEY (id);


--
-- TOC entry 3629 (class 2606 OID 20365)
-- Name: product_details product_details_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_details
    ADD CONSTRAINT product_details_product_id_key UNIQUE (product_id);


--
-- TOC entry 3631 (class 2606 OID 20367)
-- Name: product_details product_details_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_details
    ADD CONSTRAINT product_details_slug_key UNIQUE (slug);


--
-- TOC entry 3621 (class 2606 OID 20332)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3646 (class 2606 OID 20409)
-- Name: products_section_items products_section_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_section_items
    ADD CONSTRAINT products_section_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3636 (class 2606 OID 20388)
-- Name: products_sections products_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_sections
    ADD CONSTRAINT products_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3638 (class 2606 OID 20390)
-- Name: products_sections products_sections_section_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_sections
    ADD CONSTRAINT products_sections_section_type_key UNIQUE (section_type);


--
-- TOC entry 3623 (class 2606 OID 20334)
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- TOC entry 3576 (class 2606 OID 20171)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3578 (class 2606 OID 20173)
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- TOC entry 3556 (class 2606 OID 20120)
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- TOC entry 3558 (class 2606 OID 20118)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3727 (class 2606 OID 20692)
-- Name: seo_pages seo_pages_page_path_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_pages
    ADD CONSTRAINT seo_pages_page_path_key UNIQUE (page_path);


--
-- TOC entry 3729 (class 2606 OID 20690)
-- Name: seo_pages seo_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_pages
    ADD CONSTRAINT seo_pages_pkey PRIMARY KEY (id);


--
-- TOC entry 3733 (class 2606 OID 20709)
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3735 (class 2606 OID 20711)
-- Name: site_settings site_settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_setting_key_key UNIQUE (setting_key);


--
-- TOC entry 3650 (class 2606 OID 20441)
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- TOC entry 3563 (class 2606 OID 20137)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3565 (class 2606 OID 20135)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3678 (class 1259 OID 20547)
-- Name: idx_about_section_items_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_about_section_items_active ON public.about_section_items USING btree (is_active);


--
-- TOC entry 3679 (class 1259 OID 20548)
-- Name: idx_about_section_items_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_about_section_items_data_gin ON public.about_section_items USING gin (data);


--
-- TOC entry 3680 (class 1259 OID 20544)
-- Name: idx_about_section_items_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_about_section_items_section ON public.about_section_items USING btree (section_id);


--
-- TOC entry 3681 (class 1259 OID 20546)
-- Name: idx_about_section_items_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_about_section_items_sort ON public.about_section_items USING btree (sort_order);


--
-- TOC entry 3682 (class 1259 OID 20545)
-- Name: idx_about_section_items_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_about_section_items_type ON public.about_section_items USING btree (section_type);


--
-- TOC entry 3673 (class 1259 OID 20522)
-- Name: idx_about_sections_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_about_sections_active ON public.about_sections USING btree (is_active);


--
-- TOC entry 3674 (class 1259 OID 20523)
-- Name: idx_about_sections_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_about_sections_data_gin ON public.about_sections USING gin (data);


--
-- TOC entry 3675 (class 1259 OID 20521)
-- Name: idx_about_sections_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_about_sections_type ON public.about_sections USING btree (section_type);


--
-- TOC entry 3692 (class 1259 OID 20591)
-- Name: idx_career_section_items_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_section_items_active ON public.career_section_items USING btree (is_active);


--
-- TOC entry 3693 (class 1259 OID 20592)
-- Name: idx_career_section_items_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_section_items_data ON public.career_section_items USING gin (data);


--
-- TOC entry 3694 (class 1259 OID 20588)
-- Name: idx_career_section_items_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_section_items_section ON public.career_section_items USING btree (section_id);


--
-- TOC entry 3695 (class 1259 OID 20590)
-- Name: idx_career_section_items_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_section_items_sort ON public.career_section_items USING btree (sort_order);


--
-- TOC entry 3696 (class 1259 OID 20589)
-- Name: idx_career_section_items_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_section_items_type ON public.career_section_items USING btree (section_type);


--
-- TOC entry 3687 (class 1259 OID 20566)
-- Name: idx_career_sections_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_sections_active ON public.career_sections USING btree (is_active);


--
-- TOC entry 3688 (class 1259 OID 20567)
-- Name: idx_career_sections_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_sections_data ON public.career_sections USING gin (data);


--
-- TOC entry 3689 (class 1259 OID 20565)
-- Name: idx_career_sections_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_sections_type ON public.career_sections USING btree (section_type);


--
-- TOC entry 3720 (class 1259 OID 20671)
-- Name: idx_contact_requests_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_requests_created_at ON public.contact_requests USING btree (created_at DESC);


--
-- TOC entry 3721 (class 1259 OID 20672)
-- Name: idx_contact_requests_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_requests_email ON public.contact_requests USING btree (email);


--
-- TOC entry 3722 (class 1259 OID 20670)
-- Name: idx_contact_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_requests_status ON public.contact_requests USING btree (status);


--
-- TOC entry 3713 (class 1259 OID 20654)
-- Name: idx_contact_section_items_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_section_items_active ON public.contact_section_items USING btree (is_active);


--
-- TOC entry 3714 (class 1259 OID 20655)
-- Name: idx_contact_section_items_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_section_items_data_gin ON public.contact_section_items USING gin (data);


--
-- TOC entry 3715 (class 1259 OID 20651)
-- Name: idx_contact_section_items_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_section_items_section ON public.contact_section_items USING btree (section_id);


--
-- TOC entry 3716 (class 1259 OID 20653)
-- Name: idx_contact_section_items_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_section_items_sort ON public.contact_section_items USING btree (sort_order);


--
-- TOC entry 3717 (class 1259 OID 20652)
-- Name: idx_contact_section_items_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_section_items_type ON public.contact_section_items USING btree (section_type);


--
-- TOC entry 3708 (class 1259 OID 20629)
-- Name: idx_contact_sections_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_sections_active ON public.contact_sections USING btree (is_active);


--
-- TOC entry 3709 (class 1259 OID 20630)
-- Name: idx_contact_sections_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_sections_data_gin ON public.contact_sections USING gin (data);


--
-- TOC entry 3710 (class 1259 OID 20628)
-- Name: idx_contact_sections_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_contact_sections_type ON public.contact_sections USING btree (section_type);


--
-- TOC entry 3701 (class 1259 OID 20610)
-- Name: idx_homepage_blocks_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_homepage_blocks_active ON public.homepage_blocks USING btree (is_active);


--
-- TOC entry 3702 (class 1259 OID 20611)
-- Name: idx_homepage_blocks_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_homepage_blocks_data_gin ON public.homepage_blocks USING gin (data);


--
-- TOC entry 3703 (class 1259 OID 20609)
-- Name: idx_homepage_blocks_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_homepage_blocks_type ON public.homepage_blocks USING btree (section_type);


--
-- TOC entry 3651 (class 1259 OID 20459)
-- Name: idx_industries_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_active ON public.industries USING btree (is_active);


--
-- TOC entry 3662 (class 1259 OID 20503)
-- Name: idx_industries_section_items_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_section_items_active ON public.industries_section_items USING btree (is_active);


--
-- TOC entry 3663 (class 1259 OID 20504)
-- Name: idx_industries_section_items_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_section_items_data_gin ON public.industries_section_items USING gin (data);


--
-- TOC entry 3664 (class 1259 OID 20500)
-- Name: idx_industries_section_items_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_section_items_section ON public.industries_section_items USING btree (section_id);


--
-- TOC entry 3665 (class 1259 OID 20502)
-- Name: idx_industries_section_items_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_section_items_sort ON public.industries_section_items USING btree (sort_order);


--
-- TOC entry 3666 (class 1259 OID 20501)
-- Name: idx_industries_section_items_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_section_items_type ON public.industries_section_items USING btree (section_type);


--
-- TOC entry 3655 (class 1259 OID 20478)
-- Name: idx_industries_sections_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_sections_active ON public.industries_sections USING btree (is_active);


--
-- TOC entry 3656 (class 1259 OID 20479)
-- Name: idx_industries_sections_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_sections_data_gin ON public.industries_sections USING gin (data);


--
-- TOC entry 3657 (class 1259 OID 20477)
-- Name: idx_industries_sections_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_industries_sections_type ON public.industries_sections USING btree (section_type);


--
-- TOC entry 3652 (class 1259 OID 20460)
-- Name: idx_industries_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industries_sort ON public.industries USING btree (sort_order);


--
-- TOC entry 3600 (class 1259 OID 20299)
-- Name: idx_media_files_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_files_created_at ON public.media_files USING btree (created_at);


--
-- TOC entry 3601 (class 1259 OID 20297)
-- Name: idx_media_files_file_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_files_file_type ON public.media_files USING btree (file_type);


--
-- TOC entry 3602 (class 1259 OID 20296)
-- Name: idx_media_files_folder_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_files_folder_id ON public.media_files USING btree (folder_id);


--
-- TOC entry 3603 (class 1259 OID 20298)
-- Name: idx_media_files_uploaded_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_files_uploaded_by ON public.media_files USING btree (uploaded_by);


--
-- TOC entry 3594 (class 1259 OID 20272)
-- Name: idx_media_folders_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_folders_parent_id ON public.media_folders USING btree (parent_id);


--
-- TOC entry 3595 (class 1259 OID 20273)
-- Name: idx_media_folders_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_folders_slug ON public.media_folders USING btree (slug);


--
-- TOC entry 3590 (class 1259 OID 20252)
-- Name: idx_menus_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menus_is_active ON public.menus USING btree (is_active);


--
-- TOC entry 3591 (class 1259 OID 20251)
-- Name: idx_menus_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menus_parent_id ON public.menus USING btree (parent_id);


--
-- TOC entry 3579 (class 1259 OID 20201)
-- Name: idx_news_categories_parent_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_categories_parent_code ON public.news_categories USING btree (parent_code);


--
-- TOC entry 3582 (class 1259 OID 20229)
-- Name: idx_news_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_category_id ON public.news USING btree (category_id);


--
-- TOC entry 3583 (class 1259 OID 20231)
-- Name: idx_news_published_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_published_date ON public.news USING btree (published_date);


--
-- TOC entry 3584 (class 1259 OID 20230)
-- Name: idx_news_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_slug ON public.news USING btree (slug);


--
-- TOC entry 3585 (class 1259 OID 20228)
-- Name: idx_news_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_status ON public.news USING btree (status);


--
-- TOC entry 3566 (class 1259 OID 20163)
-- Name: idx_permissions_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_permissions_active ON public.permissions USING btree (is_active);


--
-- TOC entry 3567 (class 1259 OID 20161)
-- Name: idx_permissions_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_permissions_code ON public.permissions USING btree (code);


--
-- TOC entry 3568 (class 1259 OID 20162)
-- Name: idx_permissions_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_permissions_module ON public.permissions USING btree (module);


--
-- TOC entry 3606 (class 1259 OID 20315)
-- Name: idx_product_categories_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_categories_active ON public.product_categories USING btree (is_active);


--
-- TOC entry 3607 (class 1259 OID 20314)
-- Name: idx_product_categories_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_categories_slug ON public.product_categories USING btree (slug);


--
-- TOC entry 3608 (class 1259 OID 20316)
-- Name: idx_product_categories_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_categories_sort ON public.product_categories USING btree (sort_order);


--
-- TOC entry 3624 (class 1259 OID 20373)
-- Name: idx_product_details_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_details_product_id ON public.product_details USING btree (product_id);


--
-- TOC entry 3625 (class 1259 OID 20374)
-- Name: idx_product_details_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_details_slug ON public.product_details USING btree (slug);


--
-- TOC entry 3613 (class 1259 OID 20342)
-- Name: idx_products_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_active ON public.products USING btree (is_active);


--
-- TOC entry 3614 (class 1259 OID 20340)
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


--
-- TOC entry 3615 (class 1259 OID 20343)
-- Name: idx_products_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_featured ON public.products USING btree (is_featured);


--
-- TOC entry 3616 (class 1259 OID 20345)
-- Name: idx_products_features_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_features_gin ON public.products USING gin (features);


--
-- TOC entry 3639 (class 1259 OID 20424)
-- Name: idx_products_section_items_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_section_items_active ON public.products_section_items USING btree (is_active);


--
-- TOC entry 3640 (class 1259 OID 20425)
-- Name: idx_products_section_items_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_section_items_data_gin ON public.products_section_items USING gin (data);


--
-- TOC entry 3641 (class 1259 OID 20421)
-- Name: idx_products_section_items_detail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_section_items_detail ON public.products_section_items USING btree (product_detail_id);


--
-- TOC entry 3642 (class 1259 OID 20420)
-- Name: idx_products_section_items_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_section_items_section ON public.products_section_items USING btree (section_id);


--
-- TOC entry 3643 (class 1259 OID 20423)
-- Name: idx_products_section_items_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_section_items_sort ON public.products_section_items USING btree (sort_order);


--
-- TOC entry 3644 (class 1259 OID 20422)
-- Name: idx_products_section_items_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_section_items_type ON public.products_section_items USING btree (section_type);


--
-- TOC entry 3632 (class 1259 OID 20392)
-- Name: idx_products_sections_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sections_active ON public.products_sections USING btree (is_active);


--
-- TOC entry 3633 (class 1259 OID 20393)
-- Name: idx_products_sections_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sections_data_gin ON public.products_sections USING gin (data);


--
-- TOC entry 3634 (class 1259 OID 20391)
-- Name: idx_products_sections_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_products_sections_type ON public.products_sections USING btree (section_type);


--
-- TOC entry 3617 (class 1259 OID 20346)
-- Name: idx_products_seo_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_seo_title ON public.products USING btree (seo_title);


--
-- TOC entry 3618 (class 1259 OID 20341)
-- Name: idx_products_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_slug ON public.products USING btree (slug);


--
-- TOC entry 3619 (class 1259 OID 20344)
-- Name: idx_products_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sort ON public.products USING btree (sort_order);


--
-- TOC entry 3573 (class 1259 OID 20185)
-- Name: idx_role_permissions_permission_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions USING btree (permission_id);


--
-- TOC entry 3574 (class 1259 OID 20184)
-- Name: idx_role_permissions_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_permissions_role_id ON public.role_permissions USING btree (role_id);


--
-- TOC entry 3553 (class 1259 OID 20122)
-- Name: idx_roles_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_active ON public.roles USING btree (is_active);


--
-- TOC entry 3554 (class 1259 OID 20121)
-- Name: idx_roles_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_code ON public.roles USING btree (code);


--
-- TOC entry 3723 (class 1259 OID 20693)
-- Name: idx_seo_pages_path; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seo_pages_path ON public.seo_pages USING btree (page_path);


--
-- TOC entry 3724 (class 1259 OID 20695)
-- Name: idx_seo_pages_structured_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seo_pages_structured_data_gin ON public.seo_pages USING gin (structured_data);


--
-- TOC entry 3725 (class 1259 OID 20694)
-- Name: idx_seo_pages_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seo_pages_type ON public.seo_pages USING btree (page_type);


--
-- TOC entry 3730 (class 1259 OID 20713)
-- Name: idx_site_settings_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_site_settings_category ON public.site_settings USING btree (category);


--
-- TOC entry 3731 (class 1259 OID 20712)
-- Name: idx_site_settings_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_site_settings_key ON public.site_settings USING btree (setting_key);


--
-- TOC entry 3647 (class 1259 OID 20442)
-- Name: idx_testimonials_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_testimonials_active ON public.testimonials USING btree (is_active);


--
-- TOC entry 3648 (class 1259 OID 20443)
-- Name: idx_testimonials_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_testimonials_sort ON public.testimonials USING btree (sort_order);


--
-- TOC entry 3559 (class 1259 OID 20143)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3560 (class 1259 OID 20145)
-- Name: idx_users_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role_id ON public.users USING btree (role_id);


--
-- TOC entry 3561 (class 1259 OID 20144)
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- TOC entry 3768 (class 2620 OID 20810)
-- Name: about_section_items update_about_section_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_about_section_items_updated_at BEFORE UPDATE ON public.about_section_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3767 (class 2620 OID 20809)
-- Name: about_sections update_about_sections_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_about_sections_updated_at BEFORE UPDATE ON public.about_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3770 (class 2620 OID 20812)
-- Name: career_section_items update_career_section_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_career_section_items_updated_at BEFORE UPDATE ON public.career_section_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3769 (class 2620 OID 20811)
-- Name: career_sections update_career_sections_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_career_sections_updated_at BEFORE UPDATE ON public.career_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3774 (class 2620 OID 20816)
-- Name: contact_requests update_contact_requests_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_contact_requests_updated_at BEFORE UPDATE ON public.contact_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3773 (class 2620 OID 20815)
-- Name: contact_section_items update_contact_section_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_contact_section_items_updated_at BEFORE UPDATE ON public.contact_section_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3772 (class 2620 OID 20814)
-- Name: contact_sections update_contact_sections_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_contact_sections_updated_at BEFORE UPDATE ON public.contact_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3771 (class 2620 OID 20813)
-- Name: homepage_blocks update_homepage_blocks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_homepage_blocks_updated_at BEFORE UPDATE ON public.homepage_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3766 (class 2620 OID 20808)
-- Name: industries_section_items update_industries_section_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_industries_section_items_updated_at BEFORE UPDATE ON public.industries_section_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3765 (class 2620 OID 20807)
-- Name: industries_sections update_industries_sections_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_industries_sections_updated_at BEFORE UPDATE ON public.industries_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3764 (class 2620 OID 20806)
-- Name: industries update_industries_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3757 (class 2620 OID 20799)
-- Name: media_files update_media_files_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON public.media_files FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3756 (class 2620 OID 20798)
-- Name: media_folders update_media_folders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_media_folders_updated_at BEFORE UPDATE ON public.media_folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3755 (class 2620 OID 20797)
-- Name: menus update_menus_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON public.menus FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3754 (class 2620 OID 20796)
-- Name: news update_news_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3758 (class 2620 OID 20800)
-- Name: product_categories update_product_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3760 (class 2620 OID 20802)
-- Name: product_details update_product_details_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_product_details_updated_at BEFORE UPDATE ON public.product_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3762 (class 2620 OID 20804)
-- Name: products_section_items update_products_section_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_products_section_items_updated_at BEFORE UPDATE ON public.products_section_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3761 (class 2620 OID 20803)
-- Name: products_sections update_products_sections_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_products_sections_updated_at BEFORE UPDATE ON public.products_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3759 (class 2620 OID 20801)
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3775 (class 2620 OID 20817)
-- Name: seo_pages update_seo_pages_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON public.seo_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3776 (class 2620 OID 20818)
-- Name: site_settings update_site_settings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3763 (class 2620 OID 20805)
-- Name: testimonials update_testimonials_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3753 (class 2620 OID 20795)
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3750 (class 2606 OID 20539)
-- Name: about_section_items about_section_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_section_items
    ADD CONSTRAINT about_section_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.about_sections(id) ON DELETE CASCADE;


--
-- TOC entry 3751 (class 2606 OID 20583)
-- Name: career_section_items career_section_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_section_items
    ADD CONSTRAINT career_section_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.career_sections(id) ON DELETE CASCADE;


--
-- TOC entry 3752 (class 2606 OID 20646)
-- Name: contact_section_items contact_section_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_section_items
    ADD CONSTRAINT contact_section_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.contact_sections(id) ON DELETE CASCADE;


--
-- TOC entry 3749 (class 2606 OID 20495)
-- Name: industries_section_items industries_section_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industries_section_items
    ADD CONSTRAINT industries_section_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.industries_sections(id) ON DELETE CASCADE;


--
-- TOC entry 3743 (class 2606 OID 20286)
-- Name: media_files media_files_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.media_folders(id) ON DELETE SET NULL;


--
-- TOC entry 3744 (class 2606 OID 20291)
-- Name: media_files media_files_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3742 (class 2606 OID 20267)
-- Name: media_folders media_folders_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_folders
    ADD CONSTRAINT media_folders_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.media_folders(id) ON DELETE CASCADE;


--
-- TOC entry 3741 (class 2606 OID 20246)
-- Name: menus menus_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.menus(id) ON DELETE SET NULL;


--
-- TOC entry 3739 (class 2606 OID 20196)
-- Name: news_categories news_categories_parent_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_parent_code_fkey FOREIGN KEY (parent_code) REFERENCES public.news_categories(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3740 (class 2606 OID 20223)
-- Name: news news_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.news_categories(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3746 (class 2606 OID 20368)
-- Name: product_details product_details_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_details
    ADD CONSTRAINT product_details_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3745 (class 2606 OID 20335)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE SET NULL;


--
-- TOC entry 3747 (class 2606 OID 20415)
-- Name: products_section_items products_section_items_product_detail_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_section_items
    ADD CONSTRAINT products_section_items_product_detail_id_fkey FOREIGN KEY (product_detail_id) REFERENCES public.product_details(id) ON DELETE CASCADE;


--
-- TOC entry 3748 (class 2606 OID 20410)
-- Name: products_section_items products_section_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_section_items
    ADD CONSTRAINT products_section_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.products_sections(id) ON DELETE CASCADE;


--
-- TOC entry 3737 (class 2606 OID 20179)
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- TOC entry 3738 (class 2606 OID 20174)
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 3736 (class 2606 OID 20138)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- Completed on 2026-01-14 09:44:59

--
-- PostgreSQL database dump complete
--

\unrestrict e1emlQPrrJiEvUw2cOMbfqGWqpy8KnzFN6A71tY4jXTdTAONxYpOGP6HWgnqaOc

-- Completed on 2026-01-14 09:44:59

--
-- PostgreSQL database cluster dump complete
--

