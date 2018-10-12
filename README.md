# Bazel JavaScript Examples

Examples demonstrate building JavaScript with Bazel.

<table>
    <tr>
        <td><img src="https://bazel.build/images/bazel-icon.svg" height="120"/></td>
        <td><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" height="120"/></td>
        <td><img src="https://nodejs.org/static/images/logo.svg" height="120"/></td>
        <td><img src="https://yarnpkg.com/assets/feature-speed.png" height="120"/></td>
    </tr>
    <tr>
        <td>Bazel</td>
        <td>JavaScript</td>
        <td>NodeJs</td>
        <td>Yarn</td>
    </tr>
</table>


## Installing

Following the [official guide](https://docs.bazel.build/versions/master/install.html) to install bazel.


## Runnging the Examples

```bash
$ bazel run //:app
```

If everything goes well, it will print `hello, {name}`.

![screenshot of the bazel javascript example building result](bazel_javascript_example.png)


## What's included in this Example

### 1. A basic setup for building JavaScript using bazel

#### [bazel.rc](./tools/bazel.rc)

[bazel.rc](./tools/bazel.rc) contains the most common setup for bazel.
- `build --symlink_prefix=/` avoids creating symlinks like bazel-out in the project root. The output's annoy and cause performance issue with the editor.
- `query --output=label_kind` more usful when prints the `query` result with name and kind.


#### [WORKSPACE](./WORKSPACE)

[WORKSPACE](./WORKSPACE) contains minimal setup for building the JavaScript code.

1. load rules and setup for nodejs

```bazel
git_repository(
    name = "build_bazel_rules_nodejs",
    remote = "https://github.com/bazelbuild/rules_nodejs.git",
    tag = "0.15.0", # check for the latest tag when you install
)

load("@build_bazel_rules_nodejs//:package.bzl", "rules_nodejs_dependencies")
rules_nodejs_dependencies()
```

2. install nodejs, npm and yarn for the project

```bazel
load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories")

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies into your node_modules folder.
# You must still run the package manager to do this.
node_repositories(package_json = ["//:package.json"])
```

3. Using Bazel-managed dependencies

```bazel
load("@build_bazel_rules_nodejs//:defs.bzl", "yarn_install")

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)
```


### 2. Loading and consume packages from npm

When runing bazel the first time, it will automatically install dependencies. Alternatively you can manually install by running:

```bash
$ bazel run @nodejs//:yarn
```

Access the npm packages within `BUILD.bazel` With the [fine-grained npm package dependencies](https://github.com/bazelbuild/rules_nodejs#fine-grained-npm-package-dependencies) setup in `WORKSPACE`.

```bazel
load("@build_bazel_rules_nodejs//:defs.bzl", "nodejs_binary")

nodejs_binary(
    name = "app",
    install_source_map_support = False,
    entry_point = "bazel_js_example/src/index.js",
    data = [
        "src/lib.js",
        "src/index.js",
        "@npm//lodash",
    ]
)
```

