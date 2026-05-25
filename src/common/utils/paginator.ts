export interface PrismaDelegate {
  findMany(args: unknown): Promise<any[]>;
  count(args: unknown): Promise<number>;
}

export interface PaginationQuery {
  page?: string;
  per_page?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: string;
}

export interface PaginateOptions<T, R = T> {
  where?: Record<string, unknown>;
  whereNot?: Record<string, unknown>;
  select?: Record<string, unknown>;
  include?: Record<string, unknown>;
  searchFields?: string[];
  allowedSorts?: string[];
  transform?: (item: T) => R;
}

export interface PaginatedResult<T> {
  data: T[];

  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    path: string;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
  };

  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export async function paginate<T = unknown, R = T>(
  model: PrismaDelegate,

  options: PaginateOptions<T, R>,

  query: PaginationQuery,

  request: Request,
): Promise<PaginatedResult<R>> {
  const {
    where = {},
    whereNot,
    select,
    include,
    searchFields = [],
    allowedSorts = ['createdAt'],
    transform,
  } = options;

  const page = Math.max(1, Number(query.page ?? 1));

  const perPage = Math.min(100, Math.max(1, Number(query.per_page ?? 15)));

  const search = query.search?.trim();

  const sortBy = allowedSorts.includes(query.sort_by ?? '')
    ? query.sort_by!
    : 'createdAt';

  const sortDir = query.sort_dir === 'asc' ? 'asc' : 'desc';

  const baseWhere = whereNot
    ? {
        ...where,
        NOT: whereNot,
      }
    : where;

  const finalWhere =
    search && searchFields.length
      ? {
          AND: [
            baseWhere,
            {
              OR: searchFields.map((field) => ({
                [field]: {
                  contains: search,
                  mode: 'insensitive',
                },
              })),
            },
          ],
        }
      : baseWhere;

  const skip = (page - 1) * perPage;

  const [rows, total] = await Promise.all([
    model.findMany({
      where: finalWhere,

      ...(select && {
        select,
      }),

      ...(include && {
        include,
      }),

      orderBy: {
        [sortBy]: sortDir,
      },

      skip,

      take: perPage,
    }),

    model.count({
      where: finalWhere,
    }),
  ]);

  const lastPage = Math.max(1, Math.ceil(total / perPage));

  const from = total === 0 ? null : skip + 1;

  const to = total === 0 ? null : Math.min(skip + perPage, total);

  const url = new URL(request.url);

  const basePath = `${url.origin}${url.pathname}`;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();

    params.set('page', String(p));

    if (perPage !== 15) {
      params.set('per_page', String(perPage));
    }

    if (search) {
      params.set('search', search);
    }

    if (query.sort_by) {
      params.set('sort_by', query.sort_by);
    }

    if (query.sort_dir) {
      params.set('sort_dir', query.sort_dir);
    }

    return `${basePath}?${params.toString()}`;
  };

  const links = [
    {
      url: page > 1 ? buildUrl(page - 1) : null,

      label: '&laquo; Previous',

      active: false,
    },

    ...Array.from(
      {
        length: lastPage,
      },
      (_, i) => ({
        url: buildUrl(i + 1),

        label: String(i + 1),

        active: i + 1 === page,
      }),
    ),

    {
      url: page < lastPage ? buildUrl(page + 1) : null,

      label: 'Next &raquo;',

      active: false,
    },
  ];

  const finalData = transform ? rows.map(transform) : rows;

  return {
    data: finalData as R[],

    meta: {
      total,
      per_page: perPage,
      current_page: page,
      last_page: lastPage,
      from,
      to,
      path: basePath,
      first_page_url: buildUrl(1),
      last_page_url: buildUrl(lastPage),
      next_page_url: page < lastPage ? buildUrl(page + 1) : null,
      prev_page_url: page > 1 ? buildUrl(page - 1) : null,
    },
    links,
  };
}
