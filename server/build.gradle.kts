plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	id("org.springframework.boot") version "3.4.5"
	id("io.spring.dependency-management") version "1.1.7"
	kotlin("plugin.jpa") version "1.9.25"
	id("com.google.cloud.tools.jib") version "3.4.0"
}

group = "com.omsk"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.apache.poi:poi-ooxml:5.2.2")
	implementation("org.flywaydb:flyway-core:9.21.0")
	implementation("com.github.librepdf:openpdf:1.3.30")

	runtimeOnly("org.postgresql:postgresql")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

jib {
	from {
		image = "eclipse-temurin:17-jre"
	}
	to {
		image = "kp-docker/kp-generation-service"
		tags = setOf("latest")
	}
	container {
		ports = listOf("8080")
		jvmFlags = listOf("-Xms512m", "-Xmx512m")
	}
}

tasks.named("build") {
	finalizedBy("jibDockerBuild")
}

/*
tasks.withType<Test> {
	useJUnitPlatform()
}
 */
